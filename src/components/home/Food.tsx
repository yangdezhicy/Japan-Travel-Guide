import { FOOD_BY_REGION, REGIONS } from '../../data/index'
import type { RegionId } from '../../data/types'
import FavBtn from '../common/FavBtn'
import ZoomImg from '../common/ZoomImg'

export interface FoodProps {
  activeRegionId: RegionId
  onOpenFood: (id: string) => void
}

export default function Food({ activeRegionId, onOpenFood }: FoodProps) {
  const region = REGIONS.find((item) => item.id === activeRegionId) || REGIONS[0]
  const data = FOOD_BY_REGION[region.id]

  return (
    <section id="food" className="relative py-24 bg-card overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10 relative">
        <div className="max-w-3xl mb-12 reveal show">
          <div className="flex items-center gap-3 mb-5">
            <span className="section-num">— 04</span>
            <span className="eyebrow">Gourmet · Local Tastes</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black serif leading-tight">{region.name} · 舌尖上的味道</h2>
          <div className="section-rule mt-6 mb-5" />
          <p className="text-ink/65 leading-8 text-[15px]">
            从米其林寿司到街头拉面，日本的美食谱系是旅途中不可错过的风景。切换目的地，看看当地必尝的味道。
          </p>
        </div>
        <div className="grid lg:grid-cols-12 gap-8 items-stretch reveal show">
          <div className="lg:col-span-6 relative rounded-3xl overflow-hidden border hairline" style={{ minHeight: 420 }}>
            <ZoomImg src={`/images/${data.img}`} alt={`${region.name}美食`} className="card-img w-full h-full absolute inset-0 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <p className="text-white/70 text-[10px] tracking-[.28em] uppercase mb-2">{region.en} · Local Tastes</p>
              <h3 className="text-white text-3xl md:text-4xl font-black serif leading-tight">{region.name}名物</h3>
              <div className="section-rule bg-terracotta mt-4" />
            </div>
          </div>
          <div className="lg:col-span-6 grid sm:grid-cols-2 gap-4">
            {data.items.map((item, index) => (
              <article
                key={`${region.id}-${item.title}`}
                className="relative bg-paper rounded-2xl p-6 border hairline hover:border-pine/40 hover:-translate-y-1 transition-all flex flex-col cursor-pointer"
                onClick={() => onOpenFood(`${region.id}:${index}`)}
              >
                <FavBtn type="foods" id={`${region.id}:${index}`} />
                <div className="flex items-center justify-between mb-3">
                  <span className="serif text-terracotta font-semibold text-sm">— {String(index + 1).padStart(2, '0')}</span>
                </div>
                <h4 className="serif font-bold text-lg text-ink leading-snug mb-2">{item.title}</h4>
                <p className="text-ink/65 text-[13.5px] leading-7">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
