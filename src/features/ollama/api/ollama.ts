const OLLAMA_BASE = "http://localhost:11434"

export async function sendChatMessage(
  modelName: string,
  message: string,
  signal?: AbortSignal,
): Promise<string> {
  const res = await fetch(`${OLLAMA_BASE}/api/generate`, {
    method: "POST",
    body: JSON.stringify({
      model: modelName,
      prompt: message,
      stream: false,
    }),
    signal,
  })
  if (!res.ok) throw new Error(`Chat failed: ${res.statusText}`)
  const data = await res.json()
  return data.response as string
}

export async function unloadModel(modelName: string): Promise<void> {
  try {
    await fetch(`${OLLAMA_BASE}/api/generate`, {
      method: "POST",
      body: JSON.stringify({
        model: modelName,
        prompt: "",
        keep_alive: "0m",
        stream: false,
      }),
      signal: AbortSignal.timeout(2000),
    })
  } catch {
    /* best effort */
  }
}
