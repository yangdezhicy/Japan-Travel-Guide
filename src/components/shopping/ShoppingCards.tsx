import FavBtn from '../common/FavBtn'
import ZoomImg from '../common/ZoomImg'
import { buildAmapSearchUrl, buildSouvenirImagePath } from '../../data/shoppingData'
import type { ShoppingDistrict, Souvenir } from '../../data/types'

const RANK_MEDAL = ['🥇', '🥈', '🥉']

interface StarRatingProps {
  count?: number
  dark?: boolean
}

function StarRating({ count = 0, dark = false }: StarRatingProps) {
  if (!count) return null
  return (
    <span className="flex">
      {Array.from({ length: 5 }, (_, index) => {
        const active = index < count
        return (
          <span
            key={`${count}-${index}`}
            className={`material-symbols-outlined text-[15px] ${
              active ? 'text-terracotta' : dark ? 'text-white/35' : 'text-black/15'
            }`}
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            star
          </span>
        )
      })}
    </span>
  )
}

interface SouvenirCardProps {
  item: Souvenir
  onOpen: (id: string) => void
  rank?: number
  featured?: boolean
}

export function SouvenirCard({ item, onOpen, rank, featured = false }: SouvenirCardProps) {
  const price = item.jpy.split('（').shift() || item.jpy
  const badge = typeof rank === 'number' ? (rank < 3 ? RANK_MEDAL[rank] : String(rank + 1)) : null

  return (
    <article
      onClick={() => onOpen(item.id)}
      className="sv-card group bg-card rounded-2xl border hairline overflow-hidden cursor-pointer flex flex-col"
    >
      <div className="relative overflow-hidden bg-paper" style={{ height: featured ? 220 : 184 }}>
        <ZoomImg
          src={buildSouvenirImagePath(item)}
          alt={item.name}
          className="sv-img w-full h-full object-cover"
          loading={featured || typeof rank === 'number' ? 'eager' : 'lazy'}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        {badge ? (
          <span
            className={`absolute top-3 left-3 grid place-items-center w-10 h-10 rounded-full serif font-black text-[15px] shadow ${
              rank !== undefined && rank < 3 ? 'bg-white' : 'bg-ink/75 text-white'
            }`}
          >
            {badge}
          </span>
        ) : (
          <span className="absolute top-3 left-3 tag-pill">{item.cat}</span>
        )}
        {badge ? <span className="absolute bottom-3 left-3 tag-pill">{item.cat}</span> : null}
        <FavBtn type="souvenirs" id={item.id} />
      </div>
      <div className="p-4 md:p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-2">
          <StarRating count={item.rating} />
          <span className="text-[11px] text-ink/45 text-right">{item.tag}</span>
        </div>
        <h4 className="serif font-bold text-[16px] leading-snug mt-2">{item.name}</h4>
        {item.jp ? <p className="text-[11px] text-ink/42 tracking-[.16em] mt-0.5 uppercase">{item.jp}</p> : null}
        <p className="text-[13px] text-ink/60 leading-6 mt-1 line-clamp-2">{item.short}</p>
        {item.audience?.length ? (
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {item.audience.slice(0, featured ? 3 : 2).map((tag) => (
              <span key={tag} className="text-[10.5px] px-2 py-0.5 rounded-full bg-pine/8 text-pine">
                {tag}
              </span>
            ))}
          </div>
        ) : null}
        <div className="flex items-end justify-between mt-auto pt-3 border-t hairline">
          <div>
            <p className="serif font-bold text-[15px] leading-none text-pine">{price}</p>
            <p className="text-[12px] text-ink/50 mt-1">{item.cny}</p>
          </div>
          <span className="text-[12px] text-ink/45 flex items-center gap-0.5 group-hover:text-terracotta transition">
            详情
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </span>
        </div>
      </div>
    </article>
  )
}

interface DistrictCardProps {
  district: ShoppingDistrict
}

export function DistrictCard({ district }: DistrictCardProps) {
  const mapQuery = district.mapQuery || `${district.name} ${district.address}`
  const mapUrl = buildAmapSearchUrl(mapQuery)

  return (
    <article className="bg-paper rounded-2xl border hairline p-6 hover:border-pine/35 transition-all">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h4 className="serif font-bold text-[17px] text-ink">{district.name}</h4>
          <p className="text-[11px] text-ink/45 tracking-[.2em] uppercase mt-1">{district.en}</p>
        </div>
        <span className="tag-pill shrink-0">{district.city}</span>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {district.tags.map((tag) => (
          <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full bg-pine/8 text-pine">
            {tag}
          </span>
        ))}
      </div>
      <p className="text-[13px] text-ink/72 leading-7">{district.desc}</p>
      {district.nearby?.length ? (
        <p className="text-[12px] text-ink/45 leading-6 mt-3">
          顺路可逛：{district.nearby.join(' / ')}
        </p>
      ) : null}
      <div className="grid gap-3 mt-4 pt-4 border-t hairline text-[12.5px]">
        <div className="flex items-start gap-2 text-ink/70">
          <span className="material-symbols-outlined text-pine text-[18px] mt-0.5">schedule</span>
          <div>
            <p className="text-ink font-semibold">营业时间</p>
            <p>{district.hours}</p>
          </div>
        </div>
        <a href={mapUrl} target="_blank" rel="noreferrer" className="flex items-start gap-2 text-ink/70 hover:text-pine transition">
          <span className="material-symbols-outlined text-pine text-[18px] mt-0.5">location_on</span>
          <div>
            <p className="text-ink font-semibold">地址（点击打开地图）</p>
            <p>{district.address}</p>
          </div>
        </a>
      </div>
    </article>
  )
}
