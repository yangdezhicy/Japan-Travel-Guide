import { SOUVENIRS } from '../../data/index'
import { buildSouvenirImagePath, SHOPPING_TOP50_IDS } from '../../data/shoppingData'
import type { Souvenir } from '../../data/types'
import FavBtn from '../common/FavBtn'
import ZoomImg from '../common/ZoomImg'

interface SouvenirCardProps {
  item: Souvenir
  onOpen: (id: string) => void
}

const WARM_CATEGORIES = new Set(['伴手礼限定', '餐具工艺', 'IP 周边', '动漫手办'])

function SouvenirCard({ item, onOpen }: SouvenirCardProps) {
  const accentClass = WARM_CATEGORIES.has(item.cat) ? 'text-terracotta' : 'text-pine'

  return (
    <article
      onClick={() => onOpen(item.id)}
      className="sv-card group bg-card rounded-2xl border hairline overflow-hidden cursor-pointer"
    >
      <div className="relative overflow-hidden bg-paper" style={{ height: 176 }}>
        <ZoomImg src={buildSouvenirImagePath(item)} alt={item.name} className="sv-img w-full h-full object-cover" />
        <span className="absolute top-3 left-3 tag-pill">{item.cat}</span>
        <FavBtn type="souvenirs" id={item.id} />
      </div>
      <div className="p-4 md:p-5">
        <h4 className="serif font-bold text-[15.5px] leading-snug">{item.name}</h4>
        <p className="text-[12.5px] text-ink/55 leading-5 mt-1 line-clamp-2">{item.short}</p>
        <div className="flex items-end justify-between mt-3 pt-3 border-t hairline">
          <div>
            <p className={`serif font-bold text-[15px] leading-none ${accentClass}`}>{item.jpy.split('（').shift()}</p>
            <p className="text-[12px] text-ink/50 mt-1">{item.cny}</p>
          </div>
          <span className="text-[12px] text-ink/45 flex items-center gap-0.5 group-hover:text-terracotta transition">
            详情<span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </span>
        </div>
      </div>
    </article>
  )
}

export interface SouvenirProps {
  onOpenSouvenir: (id: string) => void
}

function pickTop(ids: string[]): Souvenir[] {
  return ids
    .map((id) => SOUVENIRS.find((item) => item.id === id))
    .filter((item): item is Souvenir => Boolean(item))
}

export default function SouvenirSection({ onOpenSouvenir }: SouvenirProps) {
  const topItems = pickTop(SHOPPING_TOP50_IDS)
  const giftList = topItems.filter((item) => WARM_CATEGORIES.has(item.cat)).slice(0, 6)
  const practicalList = topItems.filter((item) => !WARM_CATEGORIES.has(item.cat)).slice(0, 6)

  return (
    <section id="souvenir" className="relative py-24 bg-card">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <div className="max-w-3xl mb-12 reveal show">
          <div className="flex items-center gap-3 mb-5">
            <span className="section-num">— 09</span>
            <span className="eyebrow">Souvenirs &amp; Shopping</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black serif leading-tight">纪念品与购物清单</h2>
          <div className="section-rule mt-6 mb-5" />
          <p className="text-ink/65 leading-8 text-[15px]">
            首页这里保留一个轻量版预览，真正完整的 Top 50 总榜、20 类分类逛法和购物商圈，请直接进入独立购物页查看。
          </p>
          <p className="text-[12.5px] text-ink/45 mt-3">
            参考汇率：约 <strong>100 日元 ≈ 4.18 元人民币</strong>（2026-07）。价格为公开参考区间，实际请以现场标价与退税规则为准。
          </p>
        </div>

        <div className="flex items-center gap-3 mb-6 reveal show">
          <span className="material-symbols-outlined text-terracotta">redeem</span>
          <h3 className="serif font-bold text-xl">送礼稳妥的高热单品</h3>
          <span className="text-ink/45 text-[13px] ml-1">适合伴手礼 / 工艺 / IP 周边</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 mb-16 reveal show">
          {giftList.map((item) => (
            <SouvenirCard key={item.id} item={item} onOpen={onOpenSouvenir} />
          ))}
        </div>

        <div className="flex items-center gap-3 mb-6 reveal show">
          <span className="material-symbols-outlined text-pine">loyalty</span>
          <h3 className="serif font-bold text-xl">自用回购型热门好物</h3>
          <span className="text-ink/45 text-[13px] ml-1">护肤 / 药妆 / 家电 / 日用护理</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 reveal show">
          {practicalList.map((item) => (
            <SouvenirCard key={item.id} item={item} onOpen={onOpenSouvenir} />
          ))}
        </div>

        <div className="mt-10 bg-pine/5 border-l-2 border-pine rounded-r-2xl p-6 reveal show">
          <div className="flex items-center gap-2 text-pine mb-2">
            <span className="material-symbols-outlined">sell</span>
            <p className="font-bold">免税小贴士</p>
          </div>
          <p className="text-[13.5px] text-ink/70 leading-7">
            在贴有 <strong>「Tax-Free」</strong> 标识的店铺，同一天同一店铺累计满 <strong>¥5,000</strong>
            （不含税）通常即可凭护照办理免税。药妆、电器、化妆品和伴手礼是最常见的免税品类，建议先逛百货试色试香，再去药妆/电器店补货。
          </p>
        </div>
      </div>
    </section>
  )
}
