import { useCallback, useRef, useState } from "react"
import { sendChatMessage } from "../api/ollama"
import { getRepoContext, validateRepoPath } from "../api/tauri"
import type { ChatMessage } from "../domain/types"

let msgId = 0

export function useChat(modelName: string, category?: "chat" | "code") {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [repoPath, setRepoPath] = useState("")
  const [repoValid, setRepoValid] = useState<boolean | null>(null)
  const [repoChecking, setRepoChecking] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  const loadingRef = useRef(false)
  const repoPathRef = useRef("")
  const repoValidRef = useRef<boolean | null>(null)

  loadingRef.current = loading
  repoPathRef.current = repoPath
  repoValidRef.current = repoValid

  const checkRepoPath = useCallback(async (path: string) => {
    if (!path.trim()) {
      setRepoValid(null)
      setRepoChecking(false)
      return
    }
    setRepoChecking(true)
    const ok = await validateRepoPath(path)
    setRepoValid(ok)
    setRepoChecking(false)
  }, [])

  const handleRepoChange = useCallback((path: string) => {
    setRepoPath(path)
    setRepoValid(null)
  }, [])

  const send = useCallback(
    async (text: string) => {
      const trimmedText = text.trim()
      if (!trimmedText || loadingRef.current) return
      setLoading(true)

      const repoValue =
        repoPathRef.current.trim() && repoValidRef.current !== false
          ? repoPathRef.current.trim()
          : null

      let richText = trimmedText
      if (repoValue && category === "code") {
        const ctx = await getRepoContext(repoValue)
        if (ctx) {
          const filesBlock = ctx.files
            .map((f) => `--- ${f.path} ---\n${f.content}`)
            .join("\n\n")
          const repoInfo = [
            ctx.tree,
            filesBlock ? `Key files:\n${filesBlock}` : "",
          ]
            .filter(Boolean)
            .join("\n\n")
          richText = `The user is asking about a code repository at: ${repoValue}\n\n${repoInfo}\n\nUser question: ${trimmedText}`
        }
      }

      setMessages((prev) => [
        ...prev,
        ...(repoValue
          ? [{ id: ++msgId, role: "context" as const, content: repoValue }]
          : []),
        { id: ++msgId, role: "user", content: trimmedText },
      ])

      const controller = new AbortController()
      abortRef.current = controller
      try {
        const response = await sendChatMessage(
          modelName,
          richText,
          controller.signal,
        )
        setMessages((prev) => [
          ...prev,
          { id: ++msgId, role: "assistant", content: response },
        ])
      } catch {
        if (controller.signal.aborted) return
        setMessages((prev) => [
          ...prev,
          { id: ++msgId, role: "assistant", content: "An error occurred" },
        ])
      } finally {
        setLoading(false)
        abortRef.current = null
      }
    },
    [modelName, category],
  )

  const abort = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  return {
    messages,
    loading,
    repoPath,
    repoValid,
    repoChecking,
    handleRepoChange,
    checkRepoPath,
    send,
    abort,
  }
}
