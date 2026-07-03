import { REGIONS } from '../../data/index'
import type { RegionId } from '../../data/types'
import { useFavorites } from '../../hooks/useFavorites'
import FavBtn from '../common/FavBtn'
import ZoomImg from '../common/ZoomImg'

export interface DestinationsProps {
  activeRegionId: RegionId
  onChangeRegion: (id: RegionId) => void
  onOpenSpot: (name: string) => void
}

export default function Destinations({ activeRegionId, onChangeRegion, onOpenSpot }: DestinationsProps) {
  const { isFav } = useFavorites()
  const region = REGIONS.find((item) => item.id === activeRegionId) || REGIONS[0]

  return (
    <section id="destinations" className="relative py-24 bg-paper">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12 reveal show">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-5">
              <span className="section-num">— 03</span>
              <span className="eyebrow">Destinations</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black serif leading-tight">七大目的地 · 深度指南</h2>
            <div className="section-rule mt-6 mb-5" />
            <p className="text-ink/65 leading-8 text-[15px]">
              点击下方标签切换城市，查看每个景点的门票、开放时间、交通与实用贴士。
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-muted text-[13px]">
            <span className="material-symbols-outlined text-[18px]">swipe</span>
            横向滑动切换
          </div>
        </div>

        <div className="flex flex-nowrap overflow-x-auto scrollbar-hide gap-2.5 pb-3 mb-12 justify-start lg:justify-center reveal show">
          {REGIONS.map((item) => {
            const active = item.id === region.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChangeRegion(item.id)}
                className={`tab-btn whitespace-nowrap px-6 py-2.5 rounded-full text-[13.5px] font-semibold border transition-all ${
                  active
                    ? 'bg-pine text-white border-pine shadow-md'
                    : 'bg-card text-ink/75 border-black/10 hover:border-pine hover:text-pine'
                }`}
              >
                <span className="tracking-wide">{item.name}</span>
                <span className="ml-2 text-[10px] tracking-[.2em] opacity-60">{item.en}</span>
              </button>
            )
          })}
        </div>

        <div className="mb-10 border-b hairline pb-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="eyebrow mb-3">{region.en}</p>
              <h3 className="text-4xl md:text-5xl font-black serif leading-tight">
                {region.name} <span className="text-ink/25 text-2xl font-normal ml-2">{region.jp}</span>
              </h3>
            </div>
            <p className="text-ink/60 text-[15px] leading-8 md:max-w-xl">{region.intro}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {region.spots.map((spot) => {
            const favored = isFav('spots', spot.name)
            return (
              <article
                key={spot.name}
                className={`spot-card group bg-card rounded-2xl overflow-hidden border hairline flex flex-col cursor-pointer ${
                  favored ? 'ring-2 ring-terracotta/40' : ''
                }`}
                onClick={() => onOpenSpot(spot.name)}
              >
                <div className="relative overflow-hidden" style={{ height: 224 }}>
                  <ZoomImg src={`/images/${spot.img}`} alt={spot.name} className="card-img w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 tag-pill">{spot.tag}</span>
                  {favored ? (
                    <span className="absolute top-3 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full text-[11px] font-semibold bg-terracotta text-white shadow-sm tracking-wide">
                      已收藏
                    </span>
                  ) : null}
                  <FavBtn type="spots" id={spot.name} />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent p-5">
                    <p className="text-white/70 text-[10px] tracking-[.28em] uppercase mb-1">{spot.jp}</p>
                    <h3 className="text-white text-2xl font-bold serif leading-tight">{spot.name}</h3>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-ink/70 text-[14px] leading-7 mb-5">{spot.desc}</p>
                  <div className="mt-auto space-y-2.5 text-[13px]">
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-pine text-[18px] mt-0.5">schedule</span>
                      <span className="text-ink/60"><b className="text-ink/85 mr-1">开放</b>{spot.hours}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-pine text-[18px] mt-0.5">confirmation_number</span>
                      <span className="text-ink/60"><b className="text-ink/85 mr-1">门票</b>{spot.ticket}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-pine text-[18px] mt-0.5">hourglass_top</span>
                      <span className="text-ink/60"><b className="text-ink/85 mr-1">时长</b>{spot.duration}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-pine text-[18px] mt-0.5">directions_transit</span>
                      <span className="text-ink/60"><b className="text-ink/85 mr-1">交通</b>{spot.transport}</span>
                    </div>
                  </div>
                  <div className="mt-5 bg-sand/40 border hairline rounded-xl p-3.5 flex gap-2">
                    <span className="material-symbols-outlined text-terracotta text-[18px] mt-0.5">lightbulb</span>
                    <p className="text-[13px] text-ink/70 leading-6">
                      <b className="text-terracottaDark mr-1">贴士</b>
                      {spot.tip}
                    </p>
                  </div>
                  <div className="mt-5 flex items-center gap-2 text-pine font-semibold text-[13px] group-hover:gap-3 transition-all">
                    <span>查看详情 · 美食 · 打卡 · 住宿</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
