/* 后端 LLM 聊天接口客户端。失败时由调用方回退到本地引擎。 */
export interface WireMessage {
  role: 'user' | 'assistant'
  content: string
}

/* 默认 AI 后端服务地址。
 * 生产环境默认使用正式域名，由 Nginx 将 /api 反向代理到模型服务。
 * 如需切换后端，可在构建时通过 VITE_API_BASE_URL 覆盖。 */
const DEFAULT_API_BASE = 'https://www.yangdezhi.com.cn'

const API_BASE = ((import.meta.env.VITE_API_BASE_URL as string | undefined) || DEFAULT_API_BASE).replace(/\/$/, '')

export function backendConfigured(): boolean {
  return API_BASE.length > 0
}

export async function chatWithBackend(messages: WireMessage[], knowledge: string): Promise<string> {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), 60000)
  try {
    const res = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, knowledge }),
      signal: controller.signal,
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = (await res.json()) as { ok?: boolean; reply?: string; error?: string }
    if (!data.ok || !data.reply) throw new Error(data.error ?? '空响应')
    return data.reply
  } finally {
    window.clearTimeout(timer)
  }
}

/* 流式对话：通过 SSE 逐 token 接收大模型输出，onDelta 每收到一段文本即回调，
 * 用于实现打字机式实时显示。返回完整回答文本；出错或空响应时抛出异常，由调用方回退。 */
export async function chatWithBackendStream(
  messages: WireMessage[],
  knowledge: string,
  onDelta: (delta: string, full: string) => void,
): Promise<string> {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), 90000)
  try {
    const res = await fetch(`${API_BASE}/api/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, knowledge }),
      signal: controller.signal,
    })
    if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`)

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    let full = ''
    let errMsg = ''
    let finished = false

    while (!finished) {
      const { value, done } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const parts = buffer.split('\n\n')
      buffer = parts.pop() ?? ''
      for (const part of parts) {
        for (const rawLine of part.split('\n')) {
          const line = rawLine.trim()
          if (!line.startsWith('data:')) continue
          const payload = line.slice(5).trim()
          if (!payload) continue
          try {
            const obj = JSON.parse(payload) as { delta?: string; done?: boolean; error?: string }
            if (obj.error) errMsg = obj.error
            if (obj.done) finished = true
            if (obj.delta) {
              full += obj.delta
              onDelta(obj.delta, full)
            }
          } catch (err) {
            void err
          }
        }
      }
    }

    if (!full) throw new Error(errMsg || '空响应')
    return full
  } finally {
    window.clearTimeout(timer)
  }
}
