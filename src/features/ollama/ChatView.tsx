import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useChat } from "./hooks/useChat"

export function ChatView({
  modelName,
  onStop,
  category,
}: {
  modelName: string
  onStop: () => void
  category?: "chat" | "code"
}) {
  const { t } = useTranslation()
  const endRef = useRef<HTMLDivElement | null>(null)
  const [inputValue, setInputValue] = useState("")

  const {
    messages,
    loading,
    repoPath,
    repoValid,
    repoChecking,
    handleRepoChange,
    checkRepoPath,
    send,
    abort,
  } = useChat(modelName, category)

  useEffect(() => {
    endRef.current?.scrollIntoView()
  })

  const handleSend = () => {
    const text = inputValue.trim()
    if (!text || loading) return
    setInputValue("")
    send(text)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col rounded-lg bg-[var(--elevate-input-bg)] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--elevate-border)]">
        <div className="flex flex-col gap-0.5 flex-1 min-w-0 mr-3">
          <span className="text-sm font-[roboto-medium] text-[var(--elevate-heading)]">
            {modelName}
          </span>
          {category === "code" && (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={repoPath}
                onChange={(e) => handleRepoChange(e.target.value)}
                onBlur={() => checkRepoPath(repoPath)}
                placeholder={t("ollama.repoPath")}
                disabled={loading}
                className="bg-[var(--elevate-bg)] border border-[var(--elevate-input-border)] rounded !px-1.5 !py-0 !leading-none !h-5 box-border !text-[16px] outline-none w-full"
              />
              <span className="w-7 inline-flex items-center justify-center shrink-0">
                {repoChecking && (
                  <span className="text-base text-[var(--elevate-muted)]">
                    ...
                  </span>
                )}
                {repoValid === true && (
                  <span className="text-base text-green-600">✓</span>
                )}
                {repoValid === false && (
                  <span className="text-base text-red-500">✗</span>
                )}
              </span>
            </div>
          )}
        </div>
        <button
          type="button"
          className="!py-1 !px-3 !text-xs !h-auto !bg-transparent !border !border-[var(--elevate-border)] !text-[var(--elevate-muted)] hover:!text-[var(--elevate-text)]"
          onClick={onStop}
        >
          {t("ollama.stop")}
        </button>
      </div>

      <div className="flex flex-col gap-2 p-4 h-[475px] overflow-y-auto">
        {messages.length === 0 && (
          <p className="text-sm text-[var(--elevate-muted)] text-center py-8">
            {t("ollama.chatPlaceholder")}
          </p>
        )}
        {messages.map((msg) =>
          msg.role === "context" ? (
            <div
              key={msg.id}
              className="text-xs text-[var(--elevate-muted)] text-center italic py-1 border-b border-[var(--elevate-border)]"
            >
              {t("ollama.repoContext")}: {msg.content}
            </div>
          ) : (
            <div
              key={msg.id}
              className={`text-sm px-3 py-2 rounded-lg max-w-[85%] ${
                msg.role === "user"
                  ? "self-end bg-[var(--elevate-button-bg)] text-[var(--elevate-text)]"
                  : "self-start bg-[var(--elevate-bg)] text-[var(--elevate-text)]"
              }`}
            >
              {msg.content}
            </div>
          ),
        )}
        {loading && (
          <div className="self-start text-sm px-3 py-2 rounded-lg bg-[var(--elevate-bg)] text-[var(--elevate-muted)]">
            {t("ollama.thinking")}
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="flex gap-2 items-start border-t border-[var(--elevate-border)] p-3">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          placeholder={t("ollama.chatInput")}
          className="flex-1 bg-[var(--elevate-bg)] border border-[var(--elevate-input-border)] rounded px-3 py-2 text-sm text-[var(--elevate-text)] outline-none"
        />
        <div className="flex flex-col gap-1">
          <button
            type="button"
            className="button-primary !py-1.5 !px-3 !text-xs !h-auto !leading-tight"
            onClick={handleSend}
            disabled={loading || !inputValue.trim()}
          >
            {t("ollama.send")}
          </button>
          {loading && (
            <button
              type="button"
              className="!py-1 !px-3 !text-[10px] !h-auto !leading-none !bg-transparent !border !border-[var(--elevate-border)] !text-[var(--elevate-muted)] hover:!text-[var(--elevate-text)]"
              onClick={abort}
            >
              {t("ollama.stopGen")}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
