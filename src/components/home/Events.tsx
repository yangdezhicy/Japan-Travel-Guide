import { LOCAL_EVENTS, REGIONS } from '../../data/index'
import type { RegionId } from '../../data/types'
import { useFavorites } from '../../hooks/useFavorites'
import FavBtn from '../common/FavBtn'
import ZoomImg from '../common/ZoomImg'

export interface EventsProps {
  activeRegionId: RegionId
  onChangeRegion: (id: RegionId) => void
  onOpenEvent: (title: string) => void
}

export default function Events({ activeRegionId, onChangeRegion, onOpenEvent }: EventsProps) {
  const { isFav } = useFavorites()
  const region = REGIONS.find((item) => item.id === activeRegionId) || REGIONS[0]
  const events = LOCAL_EVENTS[region.id] || []

  return (
    <section id="events" className="relative py-24 bg-card">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="max-w-3xl mb-10 reveal show">
          <div className="flex items-center gap-3 mb-5">
            <span className="section-num">— 06</span>
            <span className="eyebrow">当地活动</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black serif leading-tight">当地活动 · 节日与祭典</h2>
          <div className="section-rule mt-6 mb-5" />
          <p className="text-ink/65 leading-8 text-[15px]">
            跟着日历走的旅行，是最能触摸日本季节脉搏的方式。从东京神田祭的神轿巡游、京都祇园祭的山鉾巡行，到北海道札幌雪祭的巨型雪雕与冲绳的全岛太鼓祭——把日期算准，让旅程与祭典撞个满怀。
          </p>
        </div>

        <div className="flex flex-nowrap overflow-x-auto scrollbar-hide gap-2.5 pb-3 mb-10 justify-start lg:justify-center reveal show">
          {REGIONS.map((item) => {
            const active = item.id === region.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChangeRegion(item.id)}
                className={`events-tab-btn whitespace-nowrap px-6 py-2.5 rounded-full text-[13.5px] font-semibold border transition-all ${
                  active
                    ? 'bg-terracotta text-white border-terracotta shadow-md'
                    : 'bg-card text-ink/75 border-black/10 hover:border-terracotta hover:text-terracotta'
                }`}
              >
                <span className="tracking-wide">{item.name}</span>
                <span className="ml-2 text-[10px] tracking-[.2em] opacity-60">{item.en}</span>
              </button>
            )
          })}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7 reveal show">
          {events.map((event) => {
            const favored = isFav('events', event.title)
            return (
              <article
                key={event.title}
                className={`event-card group bg-paper rounded-2xl overflow-hidden border hairline hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer relative ${
                  favored ? 'ring-2 ring-terracotta/40' : ''
                }`}
                onClick={() => onOpenEvent(event.title)}
              >
                {favored ? (
                  <span className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-[11px] font-semibold bg-terracotta text-white shadow-sm tracking-wide">
                    已收藏
                  </span>
                ) : null}
                <FavBtn type="events" id={event.title} />
                <div className="relative overflow-hidden event-card-media">
                  <ZoomImg src={`/images/${event.img}`} alt={event.title} className="card-img w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-white/90 text-ink text-[11px] font-semibold tracking-wide shadow-sm">
                    {event.tag || '祭典'}
                  </span>
                  <span className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-terracotta text-white text-[11px] font-semibold tracking-wide shadow-sm">
                    {event.date}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-[11px] text-muted tracking-[.18em] uppercase mb-2">
                    <span className="material-symbols-outlined text-[14px] text-terracotta">place</span>
                    <span>{event.place}</span>
                  </div>
                  <h4 className="serif font-bold text-xl text-ink leading-snug">
                    {event.title} <span className="text-ink/35 text-[12px] font-normal ml-1">{event.jp || ''}</span>
                  </h4>
                  <p className="text-ink/65 text-[13.5px] leading-7 mt-3">{event.desc}</p>
                  <ul className="mt-4 space-y-2">
                    {(event.tips || []).slice(0, 3).map((tip) => (
                      <li key={tip} className="flex gap-2 items-start">
                        <span className="material-symbols-outlined text-terracotta text-[15px] mt-0.5">check_circle</span>
                        <span className="text-ink/70 text-[13px] leading-6">{tip}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 flex items-center gap-2 text-pine font-semibold text-[13px] group-hover:gap-3 transition-all">
                    <span>查看活动详情</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
        <p className="text-[12px] text-muted mt-8 tracking-wider text-center reveal show">
          祭典日期依当年官方公告为准，行前请再次确认。图片仅作氛围参考，图源自本站已有图库。
        </p>
      </div>
    </section>
  )
}
