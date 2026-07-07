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
 * 识别形如「### Day 1｜标题」「## 第2天：标题」等日程小标题，收集其下的要点。 */
function parseItinerary(md: string): ItineraryDay[] {
  const days: ItineraryDay[] = []
  let cur: ItineraryDay | null = null
  for (const raw of md.split('\n')) {
    const line = raw.trim()
    const head = line.match(/^#{1,4}\s*(?:🗓️?\s*)?(Day\s*\d+|第\s*\d+\s*天|D\d+)\s*[｜|:：、\-—\s]+\s*(.+?)\s*$/i)
    if (head) {
      if (cur) days.push(cur)
      cur = { day: head[1].replace(/\s+/g, ''), title: head[2].replace(/[*#]/g, '').trim(), items: [] }
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
  const persisted = useMemo(() => loadPersisted(), [])
  const [messages, setMessages] = useState<ChatMessage[]>(persisted?.messages ?? [WELCOME])

  const contextRef = useRef<AssistantContext>(persisted?.context ?? createInitialContext())
  const idRef = useRef(persisted?.lastId ?? 0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const latestTips = useMemo(() => TRAVEL_KNOWLEDGE_BASE.slice(0, 4), [])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
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
      }

      chatWithBackendStream(wire, knowledge, (_delta, full) => {
        setMessages((prev) => prev.map((m) => (m.id === sid ? { ...m, text: full } : m)))
      })
        .then((full) => finalizeStream(full))
        .catch(() =>
          // 流式失败：退回一次非流式接口，仍失败则用本地兜底
          chatWithBackend(wire, knowledge)
            .then((full) => finalizeStream(full))
            .catch(() => {
              setMessages((prev) => prev.filter((m) => m.id !== sid))
              setStreamId(null)
              finish(localReply)
            }),
        )
    } else {
      window.setTimeout(() => finish(localReply), 420)
    }
  }

  const clearChat = () => {
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

  return (
    <div className={`fixed transition-all duration-500 ${open ? 'inset-0 md:inset-auto md:right-6 md:bottom-6' : 'right-4 bottom-4 md:right-6 md:bottom-6'}`} style={{ zIndex: 90 }}>
      {open ? (
        <section className="w-full h-full md:h-auto md:max-w-md md:rounded-3xl bg-paper shadow-2xl md:border md:hairline overflow-hidden flex flex-col">
          <div className="text-white p-5 shrink-0 flex items-start justify-between gap-3" style={{ background: 'linear-gradient(135deg, #23241f 0%, #2f3a30 55%, #3d5142 100%)' }}>
            <div className="flex items-start gap-3">
              <span className="shrink-0 w-11 h-11 rounded-2xl bg-white/12 grid place-items-center border border-white/15">
                <span className="material-symbols-outlined text-[24px]">smart_toy</span>
              </span>
              <div>
                <p className="text-[11px] tracking-[.24em] uppercase text-white/55">Japan AI Guide</p>
                <h3 className="serif font-black text-xl mt-0.5">日本旅游 AI 小助手</h3>
                <p className="text-white/70 text-[12px] mt-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  大模型驱动 · 站内真实数据
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button type="button" onClick={clearChat} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center transition" aria-label="清空对话" title="清空对话">
                <span className="material-symbols-outlined text-[20px]">refresh</span>
              </button>
              <button type="button" onClick={() => setOpen(false)} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center transition" aria-label="收起 AI 小助手">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4" style={{ background: 'linear-gradient(180deg, #faf8f3 0%, #f4f1ea 100%)' }}>
            <div className="md:hidden h-2" /> {/* Mobile top padding */}
            {messages.map((message) => (
              <div key={message.id} className={message.role === 'user' ? 'text-right' : 'text-left'}>
                <div className={`inline-block max-w-[92%] rounded-2xl px-4 py-3 text-[13px] leading-6 text-left shadow-sm ${message.role === 'user' ? 'bg-pine text-white rounded-br-md' : 'bg-white text-ink/80 border hairline rounded-bl-md'}`}>
                  {message.role === 'assistant' ? (
                    message.text ? (
                      <>
                        <RichText text={message.text} />
                        {message.id === streamId ? (
                          <span className="inline-block w-1.5 h-4 align-middle ml-0.5 bg-pine/70 animate-pulse" />
                        ) : null}
                      </>
                    ) : (
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-ink/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 rounded-full bg-ink/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 rounded-full bg-ink/40 animate-bounce" style={{ animationDelay: '300ms' }} />
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
                              <span className="material-symbols-outlined text-[14px]">event</span>
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

                {message.role === 'assistant' && message.chips?.length ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {message.chips.map((chip) => (
                      <button key={`${message.id}-${chip}`} type="button" onClick={() => ask(chip)} className="text-[11.5px] px-3 py-1.5 rounded-full bg-pine/8 text-pine hover:bg-pine hover:text-white transition">
                        {chip}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}

            {typing && !streamId ? (
              <div className="text-left">
                <div className="inline-flex items-center gap-1.5 rounded-2xl px-4 py-3 bg-card border hairline">
                  <span className="w-2 h-2 rounded-full bg-ink/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-ink/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-ink/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            ) : null}
          </div>

          <div className="shrink-0">
            <div className="px-4 pb-3 flex flex-wrap gap-2 overflow-x-auto scrollbar-hide no-wrap">
              {AI_QUICK_QUESTIONS.slice(0, 4).map((item) => (
                <button key={item} type="button" onClick={() => ask(item)} className="whitespace-nowrap text-[11.5px] px-3.5 py-2 rounded-full bg-ink/6 text-ink/70 hover:bg-ink hover:text-white transition border hairline">
                  {item}
                </button>
              ))}
            </div>

            <form
              className="p-4 pt-0 flex gap-2"
              onSubmit={(event) => {
                event.preventDefault()
                ask(query)
              }}
            >
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="问我：带娃去东京怎么玩？"
                className="flex-1 rounded-full bg-card border hairline px-5 py-3 text-[14px] outline-none focus:border-pine shadow-sm"
              />
              <button type="submit" className="w-12 h-11 rounded-full bg-pine text-white grid place-items-center hover:bg-terracotta transition disabled:opacity-40 shadow-sm" aria-label="发送问题" disabled={typing}>
                <span className="material-symbols-outlined">send</span>
              </button>
            </form>
            <div className="md:hidden h-2" /> {/* Safe area / Keyboard padding */}
          </div>
        </section>
      ) : (
        <button type="button" onClick={() => setOpen(true)} className="group rounded-full bg-ink text-white shadow-2xl border border-white/10 pl-4 pr-5 py-3 flex items-center gap-3 hover:bg-pine transition">
          <span className="w-11 h-11 rounded-full bg-white/12 grid place-items-center group-hover:bg-white/18">
            <span className="material-symbols-outlined">smart_toy</span>
          </span>
          <span className="text-left hidden sm:block">
            <span className="block text-[11px] tracking-[.2em] uppercase text-white/55">Ask AI</span>
            <span className="block serif font-bold">日本旅游小助手</span>
          </span>
        </button>
      )}

      {!open ? (
        <div className="hidden md:block absolute right-0 bottom-20 w-72 rounded-2xl bg-paper/95 backdrop-blur border hairline shadow-lg p-4">
          <p className="text-[12px] font-bold text-ink mb-2">可以这样问我</p>
          <div className="space-y-1.5">
            {latestTips.map((item) => (
              <button key={item.id} type="button" onClick={() => ask(item.title)} className="block w-full min-h-[40px] text-left text-[12px] text-ink/65 hover:text-pine truncate">
                {item.title}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
