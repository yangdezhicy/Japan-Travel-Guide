import { Link } from 'react-router-dom'
import {
  buildBilibiliPlayerUrl,
  findEventByTitle,
  findFoodById,
  findSouvenirById,
  findSpotByName,
  INTRO_CARD_DATA,
  INTRO_REGION_SUMMARY,
  INTRO_SIGHT_CATEGORIES,
  INTRO_TICKET_ROWS,
  INTRO_VIDEO_EXAMPLES,
  REGIONS,
  SEASON_DETAILS,
  SPOT_DETAILS,
} from '../../data/index'
import type {
  IntroSightCategory,
  IntroTicketRow,
  IntroType,
  Restaurant,
  SeasonGuideCard,
  SeasonKey,
  SpotReview,
} from '../../data/types'
import { buildSouvenirImagePath } from '../../data/shoppingData'
import FavBtn from './FavBtn'
import ZoomImg from './ZoomImg'

interface StarsProps {
  count: number
  dark?: boolean
}

function Stars({ count, dark = false }: StarsProps) {
  return (
    <span className="flex">
      {Array.from({ length: 5 }, (_, index) => {
        const active = index < count
        return (
          <span
            key={`${count}-${index}`}
            className={`material-symbols-outlined text-[16px] ${
              active ? 'text-terracotta' : dark ? 'text-black/15' : 'text-white/40'
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

interface ListBlockProps {
  icon: string
  title: string
  items?: string[]
}

function ListBlock({ icon, title, items }: ListBlockProps) {
  if (!items?.length) return null

  return (
    <div className="bg-card rounded-2xl p-5 border hairline">
      <h4 className="flex items-center gap-2 font-bold text-ink mb-3 serif">
        <span className="material-symbols-outlined text-pine">{icon}</span>
        {title}
      </h4>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="chip">
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

export interface SpotDetailContentProps {
  name: string
  onClose: () => void
}

export function SpotDetailContent({ name, onClose }: SpotDetailContentProps) {
  const hit = findSpotByName(name)
  if (!hit) return null

  const { region, spot } = hit
  const detail = SPOT_DETAILS[name] || {}
  const telClean = String(detail.tel || '').replace(/[^+0-9]/g, '')
  const amapUrl = detail.lng && detail.lat
    ? `https://uri.amap.com/marker?position=${detail.lng},${detail.lat}&name=${encodeURIComponent(spot.name)}&coordinate=wgs84&callnative=0`
    : 'https://uri.amap.com'

  return (
    <>
      <div className="relative overflow-hidden md:rounded-t-3xl" style={{ height: 240 }}>
        <ZoomImg src={`/images/${spot.img}`} alt={spot.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/5" />
        <FavBtn type="spots" id={spot.name} pos="modal" />
        <div className="absolute bottom-0 p-7">
          <span className="tag-pill mb-2">{region.name} · {spot.tag}</span>
          <h3 className="text-white font-black serif mt-3 leading-tight text-3xl">{spot.name}</h3>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span className="text-white/85 uppercase text-[12px] tracking-[.28em]">{spot.jp}</span>
            <span className="text-terracotta text-sm font-bold">★ {detail.rating || '4.5'}</span>
          </div>
        </div>
      </div>
      <div className="p-6 md:p-8 space-y-5" style={{ maxHeight: 'calc(100vh - 16rem)', overflowY: 'auto' }}>
        <p className="text-ink/80 leading-8 text-[15px]">{spot.desc}</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <a
            href={amapUrl}
            target="_blank"
            rel="noreferrer"
            className="group flex items-start gap-3 bg-pine/5 hover:bg-pine/10 border border-pine/25 rounded-xl p-4 transition"
          >
            <span className="material-symbols-outlined text-pine mt-0.5">location_on</span>
            <span className="text-sm">
              <b className="text-ink">地址（点击打开高德地图）</b>
              <br />
              <span className="text-ink/70">{detail.addr || '—'}</span>
              <br />
              <span className="inline-flex items-center gap-1 text-pine font-semibold mt-1">
                在地图中查看
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              </span>
            </span>
          </a>
          <a href={telClean ? `tel:${telClean}` : undefined} className="flex items-start gap-3 bg-card border hairline rounded-xl p-4">
            <span className="material-symbols-outlined text-pine mt-0.5">call</span>
            <span className="text-sm">
              <b className="text-ink">联系电话</b>
              <br />
              <span className="text-ink/70">{detail.tel || '—'}</span>
            </span>
          </a>
        </div>
        <div className="grid sm:grid-cols-3 gap-3 text-[13px]">
          {(
            [
              ['confirmation_number', '门票', spot.ticket],
              ['schedule', '开放时间', spot.hours],
              ['directions_transit', '交通', spot.transport],
            ] as const
          ).map(([icon, title, value]) => (
            <div key={title} className="bg-card border hairline rounded-xl p-4">
              <span className="material-symbols-outlined text-pine text-[18px]">{icon}</span>
              <p className="font-semibold text-ink mt-1">{title}</p>
              <p className="text-ink/70">{value}</p>
            </div>
          ))}
        </div>
        <ListBlock icon="restaurant" title="周边美食推荐" items={detail.food} />
        <ListBlock icon="photo_camera" title="必打卡拍照点" items={detail.checkin} />
        <ListBlock icon="hotel" title="住宿推荐" items={detail.hotels} />
        {detail.reviews && detail.reviews.length ? (
          <div className="bg-card rounded-2xl p-5 border hairline">
            <h4 className="flex items-center gap-2 font-bold text-ink mb-3 serif">
              <span className="material-symbols-outlined text-pine">reviews</span>
              游客评价
            </h4>
            <div className="space-y-3">
              {detail.reviews.map((review: SpotReview) => (
                <div key={`${review.u}-${review.t}`} className="border-b hairline last:border-0 pb-3 last:pb-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-ink">{review.u}</span>
                    <Stars count={review.r} dark />
                  </div>
                  <p className="text-sm text-ink/70 mt-1 leading-6">{review.t}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
        {detail.notes && detail.notes.length ? (
          <div className="bg-terracotta/5 border border-terracotta/25 rounded-2xl p-5">
            <h4 className="flex items-center gap-2 font-bold text-ink mb-3 serif">
              <span className="material-symbols-outlined text-terracotta">error</span>
              注意事项
            </h4>
            <ul className="space-y-2">
              {detail.notes.map((note: string) => (
                <li key={note} className="flex items-start gap-2 text-ink/75 leading-6 text-[13px]">
                  <span className="material-symbols-outlined text-terracotta mt-0.5 text-[16px]">chevron_right</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <div className="bg-sand/40 border hairline rounded-xl p-4 flex gap-2">
          <span className="material-symbols-outlined text-terracotta mt-0.5 text-[18px]">lightbulb</span>
          <p className="text-ink/70 leading-6 text-[13px]">
            <b className="text-terracottaDark mr-1">出行贴士</b>
            {spot.tip}
          </p>
        </div>
        <a href={amapUrl} target="_blank" rel="noreferrer" className="w-full btn-primary font-semibold py-4 rounded-full flex items-center justify-center gap-2">
          <span className="material-symbols-outlined">map</span>
          在高德地图中打开导航
        </a>
      </div>
    </>
  )
}

export interface FoodDetailContentProps {
  foodId: string
  onClose: () => void
}

export function FoodDetailContent({ foodId, onClose }: FoodDetailContentProps) {
  const hit = findFoodById(foodId)
  if (!hit) return null

  const { region, item } = hit

  return (
    <>
      <FavBtn type="foods" id={foodId} pos="modal" />
      <div className="p-6 md:p-8 pt-16">
        <p className="eyebrow mb-2">{region.name} · 美食榜单</p>
        <h3 className="serif font-black text-2xl md:text-3xl text-ink leading-tight">{item.title}</h3>
        <p className="text-ink/70 leading-7 mt-3 text-[13.5px]">{item.desc}</p>
        <div className="mt-6 mb-2 flex items-center justify-between gap-4 flex-wrap">
          <h4 className="serif font-bold text-pine flex items-center gap-2 text-[15px]">
            <span className="material-symbols-outlined text-pine text-[20px]">restaurant</span>
            推荐餐厅榜单
          </h4>
          <span className="text-ink/45 text-[11px]">基于公开评价与口碑 · 数据更新至 2025–2026</span>
        </div>
        <ul className="bg-card border hairline rounded-xl divide-y hairline">
          {(item.shops || []).map((shop: Restaurant, index: number) => {
            const tel = shop.tel || ''
            const telClean = tel.replace(/[^+0-9]/g, '')
            const rating = typeof shop.rating === 'number' ? shop.rating.toFixed(1) : ''
            const mapKeyword = encodeURIComponent(`${shop.name} ${shop.addr || ''}`)
            return (
              <li key={shop.name} className="flex items-start justify-between gap-3 py-3 px-4 border-b hairline last:border-0">
                <div className="flex-1 flex flex-col sm:flex-row sm:items-start gap-3">
                  <div className="shrink-0">
                    <span className="serif text-terracotta font-semibold text-[11px] tracking-[.3em]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-ink text-[14px]">{shop.name}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      {rating ? (
                        <div className="inline-flex items-center gap-1 text-[12px]">
                          <span className="material-symbols-outlined text-terracotta text-[16px]">star</span>
                          <span className="text-terracotta font-bold">{rating}</span>
                          <span className="text-ink/40">/ 5</span>
                        </div>
                      ) : null}
                      {shop.review ? <span className="text-ink/60 text-[12px]">{shop.review}</span> : null}
                    </div>
                    <p className="text-ink/60 mt-1 text-[12px]">地址：{shop.addr || '—'}</p>
                    <p className="text-ink/60 mt-0.5 text-[12px]">
                      电话：{' '}
                      {telClean ? (
                        <a href={`tel:${telClean}`} className="text-pine hover:underline">
                          {shop.tel}
                        </a>
                      ) : (
                        '—'
                      )}
                    </p>
                  </div>
                </div>
                <div className="shrink-0 mt-1">
                  <a
                    href={`https://uri.amap.com/search?keyword=${mapKeyword}&callnative=0`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-pine font-semibold inline-flex items-center gap-0.5 hover:underline text-[12px]"
                  >
                    <span className="material-symbols-outlined text-[16px]">map</span>
                    地图
                  </a>
                </div>
              </li>
            )
          })}
        </ul>
        <p className="text-ink/45 leading-6 mt-4 border-t hairline pt-3 text-[11px]">
          免责声明：以上餐厅信息（名称、地址、电话与评分）基于公开资料整理，可能因商家调整而发生变化；实际营业时间、菜单与价格请以门店与高德地图最新信息为准。
        </p>
      </div>
    </>
  )
}

export interface SouvenirDetailContentProps {
  souvenirId: string
  onClose: () => void
}

export function SouvenirDetailContent({ souvenirId, onClose }: SouvenirDetailContentProps) {
  const item = findSouvenirById(souvenirId)
  if (!item) return null

  const warmCats = new Set(['伴手礼限定', '餐具工艺', '家居香氛', '酒水茶饮'])
  const useWarmAccent = warmCats.has(item.cat)
  const accentText = useWarmAccent ? 'text-terracotta' : 'text-pine'
  const accentIcon = useWarmAccent ? 'text-terracotta' : 'text-pine'
  const accentBg = useWarmAccent ? 'bg-terracotta/5' : 'bg-pine/5'

  return (
    <>
      <FavBtn type="souvenirs" id={item.id} pos="modal" />
      <div className="relative bg-paper overflow-hidden md:rounded-t-3xl" style={{ height: 240 }}>
        <ZoomImg src={buildSouvenirImagePath(item)} alt={item.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
        <div className="absolute bottom-4 left-5 right-5 text-white">
          <span className="tag-pill mb-2">{item.cat} · {item.tag}</span>
          <h3 className="serif font-black text-2xl md:text-3xl leading-tight">{item.name}</h3>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <p className="text-white/80 tracking-wider text-[12.5px]">{item.en}</p>
            {item.rating ? <Stars count={item.rating} /> : null}
          </div>
        </div>
      </div>
      <div className="p-6 md:p-8">
        <div className={`flex flex-wrap items-end gap-x-6 gap-y-2 ${accentBg} border hairline rounded-2xl p-5 mb-6`}>
          <div>
            <p className="text-ink/50 mb-1 text-[12px]">参考价（日元）</p>
            <p className={`serif font-black text-2xl leading-none ${accentText}`}>{item.jpy}</p>
            {item.jpy2 ? <p className="text-ink/45 mt-1.5 text-[12px]">{item.jpy2}</p> : null}
          </div>
          <div className="border-l hairline pl-6">
            <p className="text-ink/50 mb-1 text-[12px]">约合人民币</p>
            <p className="serif font-black text-2xl text-ink leading-none">{item.cny}</p>
            <p className="text-ink/45 mt-1.5 text-[12px]">100 日元≈4.18 元</p>
          </div>
        </div>
        {item.audience && item.audience.length ? (
          <div className="mb-6">
            <h4 className="flex items-center gap-2 font-bold serif mb-2 text-[15px]">
              <span className={`material-symbols-outlined text-[20px] ${accentIcon}`}>redeem</span>
              适合人群 · 送礼场景
            </h4>
            <div className="flex flex-wrap gap-2">
              {item.audience.map((tag) => (
                <span key={tag} className="chip">{tag}</span>
              ))}
            </div>
          </div>
        ) : null}
        <h4 className="flex items-center gap-2 font-bold serif mb-2 text-[15px]">
          <span className={`material-symbols-outlined text-[20px] ${accentIcon}`}>auto_awesome</span>
          商品亮点
        </h4>
        <p className="text-ink/70 leading-8 mb-4 text-[14px]">{item.why}</p>
        {item.highlights && item.highlights.length ? (
          <ul className="mb-6 space-y-2">
            {item.highlights.map((point) => (
              <li key={point} className="flex items-start gap-2 text-ink/75 leading-7 text-[13.5px]">
                <span className={`material-symbols-outlined mt-0.5 text-[18px] ${accentIcon}`}>check_circle</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        ) : null}
        <h4 className="flex items-center gap-2 font-bold serif mb-1 text-[15px]">
          <span className={`material-symbols-outlined text-[20px] ${accentIcon}`}>pin_drop</span>
          推荐购买地（多处）
        </h4>
        <ul className="mb-2">
          {item.buy.map((buy) => {
            const keyword = encodeURIComponent(buy.n.replace(/（.*?）/g, ''))
            return (
              <li key={buy.n} className="flex items-start gap-3 py-3 border-b hairline last:border-0">
                <span className={`material-symbols-outlined mt-0.5 text-[20px] ${accentIcon}`}>storefront</span>
                <div className="flex-1">
                  <p className="font-semibold text-ink text-[14px]">{buy.n}</p>
                  <p className="text-ink/55 mt-0.5 text-[12.5px]">{buy.a}</p>
                  {buy.note ? (
                    <p className={`mt-1 inline-flex items-center gap-1 text-[12px] font-semibold ${accentIcon}`}>
                      <span className="material-symbols-outlined text-[15px]">sell</span>
                      {buy.note}
                    </p>
                  ) : null}
                </div>
                <a
                  href={`https://uri.amap.com/search?keyword=${keyword}&callnative=0`}
                  target="_blank"
                  rel="noreferrer"
                  className={`shrink-0 flex items-center gap-0.5 hover:underline text-[12px] ${accentIcon}`}
                >
                  <span className="material-symbols-outlined text-[16px]">map</span>
                  地图
                </a>
              </li>
            )
          })}
        </ul>
        <p className="text-ink/45 leading-6 mt-4 border-t hairline pt-4 text-[12px]">
          价格为 2026 年市面参考价，含税/免税与门店活动可能有差异，请以现场标价为准；点击“地图”可在高德地图中搜索附近门店。
        </p>
      </div>
    </>
  )
}

function getIntroSubtitle(type: IntroType): string {
  if (type === 'regions') return '从都市到雪国，从温泉到海岛，一站式纵览七大目的地的风格与景点数量。'
  if (type === 'categories') return '按主题快速浏览本攻略收录的重点景点，方便根据兴趣组合行程。'
  if (type === 'prices') return '以 100 日元≈4.18 元人民币（2026-07）为基准，帮助你大致预估门票预算。'
  return '结合哔哩哔哩高质量 4K / 高清实拍视频，在出发前先走一遍日本。'
}

export interface IntroDetailContentProps {
  index: number | null
  onClose: () => void
}

export function IntroDetailContent({ index, onClose }: IntroDetailContentProps) {
  if (index === null) return null
  const config = INTRO_CARD_DATA[index]
  if (!config) return null

  return (
    <>
      <div className="p-6 md:p-8">
        <p className="eyebrow mb-2">日本概览</p>
        <h3 className="serif font-black text-2xl md:text-3xl text-ink leading-tight">{config.title}</h3>
        <p className="text-[13.5px] text-ink/70 leading-7 mt-3">{getIntroSubtitle(config.type)}</p>

        {config.type === 'regions' ? (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
              {REGIONS.map((region, idx) => (
                <div key={region.id} className="bg-card rounded-2xl border hairline p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-8 h-8 rounded-full bg-pine text-white grid place-items-center serif font-bold text-[13px]">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <p className="serif font-semibold text-[14px] text-ink">{region.name}</p>
                      <p className="text-[11px] text-ink/45 tracking-[.12em]">{region.jp}</p>
                    </div>
                  </div>
                  <p className="text-[12px] text-ink/70">{INTRO_REGION_SUMMARY[region.id]}</p>
                  <p className="text-[11px] text-muted mt-2 flex items-center gap-1">
                    <span className="text-pine text-[14px]">图</span>
                    {region.spots.length} 个景点收录
                  </p>
                </div>
              ))}
            </div>
            <Link to="/?section=destinations" onClick={onClose} className="mt-6 inline-flex w-full md:w-auto btn-primary px-6 py-3 rounded-full items-center justify-center gap-2 text-[13px] font-semibold">
              <span className="text-[16px]">🧭</span>
              前往目的地版块
            </Link>
          </>
        ) : null}

        {config.type === 'categories' ? (
          <>
            <div className="grid sm:grid-cols-2 gap-4 mt-5">
              {INTRO_SIGHT_CATEGORIES.map((item: IntroSightCategory) => (
                <div key={item.name} className="bg-card rounded-2xl border hairline p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-pine text-[20px]">{item.icon}</span>
                    <div>
                      <p className="serif font-semibold text-[14px] text-ink">{item.name}</p>
                      <p className="text-[11px] text-ink/45">代表景点</p>
                    </div>
                  </div>
                  <p className="text-[12px] text-ink/70 mb-2">{item.desc}</p>
                  <ul className="text-[12px] text-ink/65 space-y-1">
                    {item.items.map((name) => (
                      <li key={name}>· {name}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <Link to="/?section=destinations" onClick={onClose} className="mt-6 inline-flex w-full md:w-auto btn-primary px-6 py-3 rounded-full items-center justify-center gap-2 text-[13px] font-semibold">
              <span className="material-symbols-outlined text-[18px]">map</span>
              跳转景点详情列表
            </Link>
          </>
        ) : null}

        {config.type === 'prices' ? (
          <>
            <div className="mt-5 rounded-xl border hairline bg-card" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              <table className="w-full text-left text-[13px]">
                <thead className="bg-paper text-ink/60 text-[12px] uppercase tracking-wider sticky top-0" style={{ zIndex: 1 }}>
                  <tr>
                    <th className="py-2.5 px-4 font-semibold">景点</th>
                    <th className="py-2.5 px-4 font-semibold">所在区域</th>
                    <th className="py-2.5 px-4 font-semibold">门票（日元）</th>
                    <th className="py-2.5 px-4 font-semibold">约合人民币</th>
                  </tr>
                </thead>
                <tbody className="divide-y hairline">
                  {INTRO_TICKET_ROWS.map((row: IntroTicketRow) => (
                    <tr key={`${row.name}-${row.region}`}>
                      <td className="py-2.5 px-4">{row.name}</td>
                      <td className="py-2.5 px-4">{row.region}</td>
                      <td className="py-2.5 px-4">{row.jpy}</td>
                      <td className="py-2.5 px-4">{row.cny}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-ink/50 leading-6 mt-3">
              汇率按 100 日元≈4.18 元人民币（2026-07）粗略折算，仅供预算参考；实际票价可能因淡旺季、线上优惠或官方调整发生变化，请以景点官网与现场价格为准。
            </p>
          </>
        ) : null}

        {config.type === 'videos' ? (
          <>
            <div className="mt-5 space-y-4">
              <p className="text-[13px] text-ink/70 leading-7">
                本网站汇总了七大目的地的高质量旅行影像，主要来自哔哩哔哩上的 4K / 高清实拍视频，涵盖城市街景、自然风光、季节限定活动与夜景美食等内容，帮助你在出发前先“试跑”行程。
              </p>
              <div className="bg-card rounded-2xl border hairline p-4">
                <h4 className="flex items-center gap-2 font-bold text-[14px] serif mb-2">
                  <span className="material-symbols-outlined text-pine text-[20px]">smart_display</span>
                  部分视频示例
                </h4>
                <ul className="text-[12px] text-ink/70 space-y-1">
                  {INTRO_VIDEO_EXAMPLES.map((item: string) => (
                    <li key={item}>· {item}</li>
                  ))}
                </ul>
              </div>
              <p className="text-[11px] text-ink/50 leading-6">所有视频版权归原作者所有，本页面仅通过官方播放器嵌入作为旅行参考；如遇播放失败，通常为作者调整了公开权限或平台限制。</p>
            </div>
            <Link to="/?section=videos" onClick={onClose} className="mt-6 inline-flex w-full md:w-auto btn-primary px-6 py-3 rounded-full items-center justify-center gap-2 text-[13px] font-semibold">
              <span className="material-symbols-outlined text-[18px]">smart_display</span>
              前往旅行影像版块
            </Link>
          </>
        ) : null}
      </div>
    </>
  )
}

export interface SeasonDetailContentProps {
  seasonKey: SeasonKey | ''
  onClose: () => void
}

export function SeasonDetailContent({ seasonKey, onClose }: SeasonDetailContentProps) {
  if (!seasonKey) return null
  const detail = SEASON_DETAILS[seasonKey]
  if (!detail) return null

  return (
    <>
      <div className="relative overflow-hidden md:rounded-t-3xl" style={{ height: 352 }}>
        <ZoomImg src={`/images/${detail.hero}`} alt={detail.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />
        <div className="absolute bottom-0 left-0 right-0 p-7">
          <span className="tag-pill mb-2">{detail.en}</span>
          <h3 className="text-white text-3xl md:text-4xl font-black serif mt-3 leading-tight">{detail.title}</h3>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span className="text-white/85 text-[13px] font-semibold tracking-wider">{detail.months}</span>
            <Stars count={detail.rating} />
          </div>
        </div>
      </div>
      <div className="p-6 md:p-8 space-y-8">
        <p className="text-ink/80 leading-8 text-[15px]">{detail.intro}</p>
        <div>
          <h4 className="flex items-center gap-2 font-bold text-ink mb-4 serif">
            <span className="material-symbols-outlined text-terracotta">tips_and_updates</span>
            出行指南
          </h4>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {detail.guide.map((guide: SeasonGuideCard) => (
              <div key={guide.title} className="bg-card rounded-2xl p-5 border hairline">
                <span className="material-symbols-outlined text-terracotta text-[22px]">{guide.icon}</span>
                <h5 className="serif font-bold text-[15px] text-ink mt-2 mb-1">{guide.title}</h5>
                <p className="text-[12.5px] text-ink/65 leading-6">{guide.text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-pine/5 border-l-2 border-pine rounded-r-2xl p-5">
            <h4 className="flex items-center gap-2 font-bold text-ink mb-3 serif">
              <span className="material-symbols-outlined text-pine">landscape</span>
              本季代表打卡地
            </h4>
            <ul className="space-y-1.5">
              {detail.highlights.map((item: string) => (
                <li key={item} className="flex items-start gap-2 text-[13.5px] text-ink/75 leading-7">
                  <span className="material-symbols-outlined text-pine text-[18px] mt-0.5">place</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-card border hairline rounded-2xl p-5">
            <h4 className="flex items-center gap-2 font-bold text-ink mb-3 serif">
              <span className="material-symbols-outlined text-terracotta">wb_sunny</span>
              气候 · 穿搭
            </h4>
            <p className="text-[13.5px] text-ink/70 leading-7 mb-3">{detail.weather}</p>
            <p className="text-[12px] text-ink/50 mb-2 font-semibold tracking-wider">建议携带</p>
            <div className="flex flex-wrap gap-2">
              {detail.carry.map((item: string) => (
                <span key={item} className="chip">{item}</span>
              ))}
            </div>
          </div>
        </div>
        <div>
          <h4 className="flex items-center gap-2 font-bold text-ink mb-4 serif">
            <span className="material-symbols-outlined text-terracotta">smart_display</span>
            本季旅行影像
          </h4>
          <div className="video-frame bg-black rounded-2xl overflow-hidden border hairline">
            <iframe
              className="w-full h-full"
              src={buildBilibiliPlayerUrl(detail.videoBV)}
              scrolling="no"
              frameBorder="0"
              allowFullScreen
              loading="lazy"
              title={detail.title}
            />
          </div>
          <p className="text-[11px] text-muted mt-2 tracking-wider">Bilibili · {detail.videoBV} · 影像版权归原作者所有</p>
        </div>
        <div>
          <h4 className="flex items-center gap-2 font-bold text-ink mb-4 serif">
            <span className="material-symbols-outlined text-terracotta">photo_library</span>
            本季风物图集
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {detail.gallery.map((image: string) => (
              <div key={image} className="overflow-hidden rounded-xl border hairline">
                <ZoomImg src={`/images/${image}`} alt={detail.title} className="w-full object-cover season-gallery-img" />
              </div>
            ))}
          </div>
        </div>
        <Link to="/?section=destinations" onClick={onClose} className="w-full btn-primary font-semibold py-4 rounded-full flex items-center justify-center gap-2">
          <span className="material-symbols-outlined">map</span>
          跳转景点详情列表
        </Link>
      </div>
    </>
  )
}

export interface EventDetailContentProps {
  title: string
  onClose: () => void
  onOpenSpot: (name: string) => void
}

export function EventDetailContent({ title, onClose, onOpenSpot }: EventDetailContentProps) {
  const hit = findEventByTitle(title)
  if (!hit) return null

  const { region, event } = hit

  return (
    <>
      <div className="relative overflow-hidden md:rounded-t-3xl" style={{ height: 256 }}>
        <ZoomImg src={`/images/${event.img}`} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/5" />
        <FavBtn type="events" id={event.title} pos="modal" />
        <div className="absolute bottom-0 p-7">
          <span className="tag-pill mb-2">{region?.name} · {event.tag || '祭典'}</span>
          <h3 className="text-white font-black serif mt-3 leading-tight text-3xl">{event.title}</h3>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span className="text-white/85 uppercase text-[12px] tracking-[.28em]">{event.jp || ''}</span>
            <span className="text-terracotta text-sm font-bold">{event.date || ''}</span>
          </div>
        </div>
      </div>
      <div className="p-6 md:p-8 space-y-5" style={{ maxHeight: 'calc(100vh - 16rem)', overflowY: 'auto' }}>
        <p className="text-ink/80 leading-8 text-[15px]">{event.desc}</p>
        <div className="grid sm:grid-cols-3 gap-3 text-[13px]">
          {(
            [
              ['event', '举办时间', event.date || '—'],
              ['place', '举办地点', event.place || '—'],
              ['local_activity', '活动类型', event.tag || '祭典'],
            ] as const
          ).map(([icon, label, value]) => (
            <div key={label} className="bg-card border hairline rounded-xl p-4">
              <span className="material-symbols-outlined text-pine text-[18px]">{icon}</span>
              <p className="font-semibold text-ink mt-1">{label}</p>
              <p className="text-ink/70">{value}</p>
            </div>
          ))}
        </div>
        {event.tips && event.tips.length ? (
          <div className="bg-terracotta/5 border border-terracotta/25 rounded-2xl p-5">
            <h4 className="flex items-center gap-2 font-bold text-ink mb-3 serif">
              <span className="material-symbols-outlined text-terracotta">tips_and_updates</span>
              参与贴士
            </h4>
            <ul className="space-y-2">
              {event.tips.map((tip: string) => (
                <li key={tip} className="flex items-start gap-2 text-ink/75 leading-6 text-[13px]">
                  <span className="material-symbols-outlined text-terracotta mt-0.5 text-[16px]">chevron_right</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {event.nearby && event.nearby.length ? (
          <div className="bg-card rounded-2xl p-5 border hairline">
            <h4 className="flex items-center gap-2 font-bold text-ink mb-3 serif">
              <span className="material-symbols-outlined text-pine">place</span>
              顺游推荐景点
            </h4>
            <div className="flex flex-wrap gap-2">
              {event.nearby.map((spotName: string) => (
                <button
                  key={spotName}
                  type="button"
                  onClick={() => onOpenSpot(spotName)}
                  className="chip hover:border-pine hover:text-pine transition"
                >
                  {spotName}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </>
  )
}
