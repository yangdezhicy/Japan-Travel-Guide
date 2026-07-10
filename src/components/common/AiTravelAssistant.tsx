import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { AI_QUICK_QUESTIONS, TRAVEL_KNOWLEDGE_BASE } from '../../data/travelKnowledgeBase'
import {
  buildKnowledgeContext,
  createInitialContext,
  respond,
  type AssistantCard,
  type AssistantContext,
} from '../../utils/assistantEngine'
import { backendConfigured, chatWithBackend, chatWithBackendStream, type WireMessage } from '../../utils/chatApi'

/* 从大模型回答的 Markdown 中解析出「分天行程」，用于渲染结构化行程速览卡片。
 * 识别形如「### 第1天｜标题」「## 第2天：标题」等日程小标题，收集其下的要点。 */
function parseItinerary(md: string): ItineraryDay[] {
  const days: ItineraryDay[] = []
  let cur: ItineraryDay | null = null
  for (const raw of md.split('\n')) {
    const line = raw.trim()
    const head = line.match(/^#{1,4}\s*(?:🗓️?\s*)?(Day\s*\d+|第\s*\d+\s*天|D\d+)\s*[｜|:：、\-—\s]+\s*(.+?)\s*$/i)
    if (head) {
      if (cur) days.push(cur)
      const dayLabel = head[1].replace(/\s+/g, '').replace(/^Day(\d+)$/i, '第$1天').replace(/^D(\d+)$/i, '第$1天')
      cur = { day: dayLabel, title: head[2].replace(/[*#]/g, '').trim(), items: [] }
      continue
    }
    if (cur) {
      const bullet = line.match(/^[-*•]\s+(.*)$/)
      if (bullet && cur.items.length < 4) cur.items.push(bullet[1].replace(/\*\*/g, '').trim())
    }
  }
  if (cur) days.push(cur)
  return days.length >= 2 ? days : []
}

interface ItineraryDay {
  day: string
  title: string
  items: string[]
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  bullets?: string[]
  chips?: string[]
  sources?: string[]
  cards?: AssistantCard[]
  itinerary?: ItineraryDay[]
}

const WELCOME: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  text: '你好，我是日本旅游 AI 小助手 👋 现已接入大模型，并结合站内真实景点、美食、购物价差、奢侈品包袋与价格数据回答，会记住你的城市 / 预算 / 同行人，尽量给出具体、可执行的建议。',
  bullets: ['试试：日本哪些奢侈品包比国内更值得买？', '试试：3 万日元预算在东京买什么划算？', '也可以直接说城市名切换话题'],
  chips: ['日本便宜国内贵的包包有哪些？', '带爸妈去关西玩什么？', '樱花季几月去？'],
}

const STORAGE_KEY = 'jp_ai_chat_v1'

interface PersistShape {
  messages: ChatMessage[]
  context: AssistantContext
  lastId: number
}

function loadPersisted(): PersistShape | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as PersistShape
    if (!Array.isArray(data.messages) || data.messages.length === 0) return null
    return data
  } catch (err) {
    void err
    return null
  }
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

/* 轻量 Markdown 渲染：支持 **加粗**、# 标题、- 列表，避免引入额外依赖与 XSS 风险 */
function renderInline(text: string): ReactNode[] {
  const counts: Record<string, number> = {}
  return text.split('**').map((part, index) => {
    const bold = index % 2 === 1
    const base = `${bold ? 'b' : 't'}:${part}`
    counts[base] = (counts[base] ?? 0) + 1
    const key = `${base}#${counts[base]}`
    return bold ? <strong key={key}>{part}</strong> : <span key={key}>{part}</span>
  })
}

function RichText({ text }: { text: string }) {
  const lines = text.split('\n')
  const counts: Record<string, number> = {}
  const keyFor = (line: string) => {
    counts[line] = (counts[line] ?? 0) + 1
    return `${line}#${counts[line]}`
  }
  return (
    <div className="space-y-1.5">
      {lines.map((raw) => {
        const line = raw.replace(/\s+$/, '')
        if (!line.trim()) return <div key={keyFor(raw)} style={{ height: 2 }} />
        const heading = line.match(/^#{1,4}\s+(.*)$/)
        if (heading) {
          return <p key={keyFor(raw)} className="font-black text-ink mt-1">{renderInline(heading[1])}</p>
        }
        const bullet = line.match(/^[-*•]\s+(.*)$/)
        if (bullet) {
          return (
            <div key={keyFor(raw)} className="flex gap-2 pl-1">
              <span className="text-terracotta">•</span>
              <span>{renderInline(bullet[1])}</span>
            </div>
          )
        }
        const numbered = line.match(/^(\d+)\.\s+(.*)$/)
        if (numbered) {
          return (
            <div key={keyFor(raw)} className="flex gap-2 pl-1">
              <span className="text-pine font-bold">{numbered[1]}.</span>
              <span>{renderInline(numbered[2])}</span>
            </div>
          )
        }
        return <p key={keyFor(raw)}>{renderInline(line)}</p>
      })}
    </div>
  )
}

export default function AiTravelAssistant() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [typing, setTyping] = useState(false)
  const [streamId, setStreamId] = useState<string | null>(null)
  const [showScrollHint, setShowScrollHint] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const localTimerRef = useRef<number | null>(null)
  const isAutoScrolling = useRef(true)
  const persisted = useMemo(() => loadPersisted(), [])
  const [messages, setMessages] = useState<ChatMessage[]>(persisted?.messages ?? [WELCOME])

  const contextRef = useRef<AssistantContext>(persisted?.context ?? createInitialContext())
  const idRef = useRef(persisted?.lastId ?? 0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const latestTips = useMemo(() => TRAVEL_KNOWLEDGE_BASE.slice(0, 4), [])

  const isNearBottom = () => {
    const node = scrollRef.current
    if (!node) return true
    return node.scrollHeight - node.scrollTop - node.clientHeight < 96
  }

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    const node = scrollRef.current
    if (!node) return
    window.requestAnimationFrame(() => {
      node.scrollTo({ top: node.scrollHeight, behavior })
    })
  }

  const handleScroll = () => {
    const nearBottom = isNearBottom()
    isAutoScrolling.current = nearBottom
    setShowScrollHint(!nearBottom)
  }

  useEffect(() => {
    if (open && isAutoScrolling.current) scrollToBottom(typing ? 'auto' : 'smooth')
  }, [messages, typing, open])

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ messages, context: contextRef.current, lastId: idRef.current }),
      )
    } catch (err) {
      void err
    }
  }, [messages])

  const nextId = () => {
    idRef.current += 1
    return `m-${idRef.current}`
  }

  const stopAnswer = () => {
    abortControllerRef.current?.abort()
    abortControllerRef.current = null
    if (localTimerRef.current) {
      window.clearTimeout(localTimerRef.current)
      localTimerRef.current = null
    }
    setTyping(false)
    setMessages((prev) =>
      prev.map((m) =>
        m.id === streamId
          ? {
              ...m,
              text: m.text || '已停止回答。你可以换个问题继续问我。',
              chips: m.chips ?? ['换个城市推荐', '重新规划 3 日游'],
              sources: m.sources ?? ['回答已中断'],
            }
          : m,
      ),
    )
    setStreamId(null)
  }

  const ask = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed || typing) return

    const userMsg: ChatMessage = { id: nextId(), role: 'user', text: trimmed }
    const priorHistory = messages.filter((m) => m.id !== 'welcome')
    setMessages((prev) => [...prev, userMsg])
    setQuery('')
    setOpen(true)
    setTyping(true)

    // 本地引擎：更新多轮上下文 + 生成兜底回答与追问建议
    const { reply, context } = respond(trimmed, contextRef.current)
    contextRef.current = context
    const knowledge = buildKnowledgeContext(trimmed, context)

    const finish = (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg])
      setTyping(false)
    }

    const localReply: ChatMessage = {
      id: nextId(),
      role: 'assistant',
      text: reply.text,
      bullets: reply.bullets,
      chips: reply.chips,
      sources: reply.sources,
      cards: reply.cards,
    }

    if (backendConfigured()) {
      const wire: WireMessage[] = [...priorHistory, userMsg].map((m) => ({ role: m.role, content: m.text }))
      const sid = nextId()
      // 先插入一个空的流式占位气泡，随后逐 token 填充
      setMessages((prev) => [...prev, { id: sid, role: 'assistant', text: '' }])
      setStreamId(sid)
      abortControllerRef.current = new AbortController()

      const finalizeStream = (fullText: string) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === sid
              ? {
                  ...m,
                  text: fullText,
                  chips: reply.chips,
                  sources: ['AI 大模型 · 站内资料'],
                  itinerary: parseItinerary(fullText),
                }
              : m,
          ),
        )
        setStreamId(null)
        setTyping(false)
        abortControllerRef.current = null
      }

      chatWithBackendStream(
        wire,
        knowledge,
        (_delta, full) => {
          setMessages((prev) => prev.map((m) => (m.id === sid ? { ...m, text: full } : m)))
        },
        abortControllerRef.current.signal,
      )
        .then((full) => finalizeStream(full))
        .catch((err) => {
          if (isAbortError(err)) return
          // 流式失败：退回一次非流式接口，仍失败则用本地兜底
          chatWithBackend(wire, knowledge)
            .then((full) => finalizeStream(full))
            .catch(() => {
              setMessages((prev) => prev.filter((m) => m.id !== sid))
              setStreamId(null)
              finish(localReply)
              abortControllerRef.current = null
            })
        })
    } else {
      localTimerRef.current = window.setTimeout(() => {
        localTimerRef.current = null
        finish(localReply)
      }, 420)
    }
  }

  const clearChat = () => {
    abortControllerRef.current?.abort()
    abortControllerRef.current = null
    if (localTimerRef.current) {
      window.clearTimeout(localTimerRef.current)
      localTimerRef.current = null
    }
    contextRef.current = createInitialContext()
    idRef.current = 0
    setMessages([WELCOME])
    setTyping(false)
    setStreamId(null)
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch (err) {
      void err
    }
  }

  const copyMessage = (text: string) => {
    if (!text.trim()) return
    void window.navigator.clipboard?.writeText(text)
  }

  return (
    <div className={`fixed transition-all duration-500 ${open ? 'inset-0 md:inset-auto md:right-6 md:bottom-6' : 'right-4 bottom-4 md:right-6 md:bottom-6'}`} style={{ zIndex: 90 }}>
      {open ? (
        <section className="w-full h-full md:h-[min(82vh,760px)] md:max-w-[480px] md:rounded-[28px] bg-white shadow-2xl md:border md:hairline overflow-hidden flex flex-col">
          <div className="shrink-0 px-4 py-3 border-b hairline bg-white/95 backdrop-blur flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className="shrink-0 w-10 h-10 rounded-2xl grid place-items-center text-xl shadow-sm" style={{ background: 'linear-gradient(135deg, #eef8f0 0%, #dff0e3 100%)' }}>
                旅
              </span>
              <div className="min-w-0">
                <h3 className="font-black text-[15px] text-ink truncate">日本旅行助手</h3>
                <p className="text-ink/50 text-[12px] mt-0.5 flex items-center gap-1.5 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  可规划行程、购物、交通和带长辈路线
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button type="button" onClick={clearChat} className="h-8 px-3 rounded-full bg-ink/5 hover:bg-ink/10 text-[12px] text-ink/65 transition" aria-label="清空对话" title="清空对话">
                清空
              </button>
              <button type="button" onClick={() => setOpen(false)} className="w-8 h-8 rounded-full bg-ink/5 hover:bg-ink/10 grid place-items-center text-ink/65 transition" aria-label="收起旅行助手">
                ×
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex-1 min-h-0 p-4 overflow-y-auto space-y-4"
            style={{ background: 'linear-gradient(180deg, #f7f8fa 0%, #f4f1ea 100%)', scrollBehavior: 'smooth' }}
          >
            <div className="md:hidden h-2" /> {/* 手机端顶部留白 */}
            {messages.map((message) => (
              <div key={message.id} className={message.role === 'user' ? 'text-right' : 'text-left'}>
                <div className={`inline-block max-w-[92%] rounded-3xl px-4 py-3 text-[13px] leading-6 text-left shadow-sm ${message.role === 'user' ? 'bg-pine text-white rounded-br-lg' : 'bg-white text-ink/80 border hairline rounded-bl-lg'}`}>
                  {message.role === 'assistant' ? (
                    message.text ? (
                      <>
                        <RichText text={message.text} />
                        {message.id === streamId ? (
                          <span className="inline-block w-1.5 h-4 align-middle ml-0.5 bg-pine/70 animate-pulse" />
                        ) : null}
                      </>
                    ) : (
                      <span className="inline-flex items-center gap-2 text-ink/55">
                        <span className="w-2 h-2 rounded-full bg-pine/55 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 rounded-full bg-pine/55 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 rounded-full bg-pine/55 animate-bounce" style={{ animationDelay: '300ms' }} />
                        <span>正在思考，马上回答…</span>
                      </span>
                    )
                  ) : (
                    <p>{message.text}</p>
                  )}

                  {message.itinerary?.length ? (
                    <div className="mt-3">
                      <p className="text-[11px] font-bold text-ink/60 mb-2 flex items-center gap-1">🗓 行程速览</p>
                      <div className="flex gap-2.5 overflow-x-auto pb-1">
                        {message.itinerary.map((d) => (
                          <div key={`${message.id}-${d.day}`} className="shrink-0 rounded-2xl bg-white border hairline overflow-hidden shadow-sm" style={{ width: 158 }}>
                            <div className="px-2.5 py-1.5 text-white flex items-center gap-1.5" style={{ background: 'linear-gradient(135deg, #c1694f 0%, #a8543c 100%)' }}>
                              <span className="text-[13px]">🗓</span>
                              <span className="text-[11px] font-black tracking-wide">{d.day}</span>
                            </div>
                            <div className="p-2.5">
                              <p className="text-[12px] font-bold text-ink leading-snug">{d.title}</p>
                              {d.items.length ? (
                                <ul className="mt-1.5 space-y-1">
                                  {d.items.slice(0, 3).map((it) => (
                                    <li key={`${message.id}-${d.day}-${it}`} className="text-[10.5px] text-ink/60 leading-snug flex gap-1">
                                      <span className="text-pine">·</span>
                                      <span className="truncate">{it}</span>
                                    </li>
                                  ))}
                                </ul>
                              ) : null}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {message.bullets?.length ? (
                    <ul className="mt-2 space-y-1.5">
                      {message.bullets.map((item) => (
                        <li key={item} className="flex gap-2">
                          <span className="text-terracotta">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {message.cards?.length ? (
                    <div className="mt-3 space-y-2">
                      {message.cards.map((card) => (
                        <a
                          key={`${message.id}-${card.title}`}
                          href={card.href ?? '#/'}
                          className="flex items-center justify-between gap-3 rounded-xl bg-paper border hairline px-3 py-2 hover:border-pine transition"
                        >
                          <span className="min-w-0">
                            <span className="block font-bold text-ink truncate">{card.title}</span>
                            {card.subtitle ? <span className="block text-[11.5px] text-ink/55 truncate">{card.subtitle}</span> : null}
                          </span>
                          {card.meta ? <span className="shrink-0 text-[11.5px] text-terracotta font-semibold">{card.meta}</span> : null}
                        </a>
                      ))}
                    </div>
                  ) : null}

                  {message.role === 'assistant' && message.sources?.length ? (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {message.sources.map((src) => (
                        <span key={src} className="text-[10.5px] px-2 py-0.5 rounded-full bg-ink/6 text-ink/50">来源 · {src}</span>
                      ))}
                    </div>
                  ) : null}
                </div>

                {message.role === 'assistant' && message.text && message.id !== 'welcome' && message.id !== streamId ? (
                  <div className="mt-2 flex items-center gap-2 text-[11.5px] text-ink/45">
                    <button type="button" onClick={() => copyMessage(message.text)} className="px-2.5 py-1 rounded-full hover:bg-white hover:text-pine transition">
                      复制
                    </button>
                    <button type="button" onClick={() => ask(`请把上面的建议换一种更清晰、更适合手机阅读的方式重新整理：${message.text.slice(0, 120)}`)} disabled={typing} className="px-2.5 py-1 rounded-full hover:bg-white hover:text-pine transition disabled:opacity-40 disabled:cursor-not-allowed">
                      重新整理
                    </button>
                  </div>
                ) : null}

                {message.role === 'assistant' && message.chips?.length ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {message.chips.map((chip) => (
                      <button
                        key={`${message.id}-${chip}`}
                        type="button"
                        onClick={() => ask(chip)}
                        disabled={typing}
                        className="text-[11.5px] px-3 py-1.5 rounded-full bg-pine/8 text-pine hover:bg-pine hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-pine/8 disabled:hover:text-pine"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}

            {typing && !streamId ? (
              <div className="text-left">
                <div className="inline-flex items-center gap-2 rounded-2xl px-4 py-3 bg-white border hairline text-[13px] text-ink/55 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-pine/55 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-pine/55 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-pine/55 animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span>正在整理站内资料…</span>
                </div>
              </div>
            ) : null}
          </div>

          <div className="shrink-0">
            {showScrollHint ? (
              <div className="px-4 pt-2 pb-1 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    isAutoScrolling.current = true
                    setShowScrollHint(false)
                    scrollToBottom()
                  }}
                  className="text-[11.5px] px-3 py-1.5 rounded-full bg-white border hairline text-pine shadow-sm hover:bg-pine hover:text-white transition"
                >
                  回到底部
                </button>
              </div>
            ) : null}
            {typing ? (
              <div className="px-4 pb-2 text-[11.5px] text-ink/45 flex items-center justify-between gap-2">
                <span>AI 正在回答，期间快捷问题已暂停</span>
                <button type="button" onClick={stopAnswer} className="font-bold text-terracotta hover:text-pine transition">
                  停止回答
                </button>
              </div>
            ) : null}
            <div className="px-4 pb-3 flex flex-wrap gap-2 overflow-x-auto scrollbar-hide no-wrap">
              {AI_QUICK_QUESTIONS.slice(0, 4).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => ask(item)}
                  disabled={typing}
                  className="whitespace-nowrap text-[11.5px] px-3.5 py-2 rounded-full bg-ink/6 text-ink/70 hover:bg-ink hover:text-white transition border hairline disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-ink/6 disabled:hover:text-ink/70"
                >
                  {item}
                </button>
              ))}
            </div>

            <form
              className="px-4 pb-4 pt-0"
              onSubmit={(event) => {
                event.preventDefault()
                if (typing) {
                  stopAnswer()
                  return
                }
                ask(query)
              }}
            >
              <div className="flex items-end gap-2 rounded-[24px] bg-white border hairline px-3 py-2 shadow-sm focus-within:border-pine">
                <textarea
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault()
                      if (typing) stopAnswer()
                      else ask(query)
                    }
                  }}
                  rows={1}
                  placeholder={typing ? '正在回答中，可先输入下一句' : '问问日本旅行、购物或交通安排'}
                  className="max-h-28 min-h-[42px] flex-1 resize-none bg-transparent px-2 py-2.5 text-[14px] leading-5 outline-none"
                />
                <button
                  type="submit"
                  className={`h-10 px-4 rounded-full text-white text-[13px] font-bold transition shadow-sm ${typing ? 'bg-terracotta hover:bg-pine' : query.trim() ? 'bg-pine hover:bg-terracotta' : 'bg-ink/30'}`}
                  aria-label={typing ? '停止回答' : '发送问题'}
                >
                  {typing ? '停止' : '发送'}
                </button>
              </div>
              <p className="px-2 pt-2 text-[11px] text-ink/35">按 Enter 发送，Shift + Enter 换行</p>
            </form>
            <div className="md:hidden h-2" /> {/* 安全区与键盘留白 */}
          </div>
        </section>
      ) : (
        <button type="button" onClick={() => setOpen(true)} className="group rounded-full bg-ink text-white shadow-2xl border border-white/10 pl-3 pr-5 py-3 flex items-center gap-3 hover:bg-pine transition">
          <span className="w-11 h-11 rounded-full bg-white/12 grid place-items-center group-hover:bg-white/18 font-black">
            旅
          </span>
          <span className="text-left hidden sm:block">
            <span className="block text-[11px] tracking-[.18em] text-white/55">旅行助手</span>
            <span className="block serif font-bold">问问日本攻略</span>
          </span>
        </button>
      )}

      {!open ? (
        <div className="hidden md:block absolute right-0 bottom-20 w-72 rounded-2xl bg-paper/95 backdrop-blur border hairline shadow-lg p-4">
          <p className="text-[12px] font-bold text-ink mb-2">可以这样问我</p>
          <div className="space-y-1.5">
            {latestTips.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => ask(item.title)}
                disabled={typing}
                className="block w-full min-h-[40px] text-left text-[12px] text-ink/65 hover:text-pine truncate disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-ink/65"
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
