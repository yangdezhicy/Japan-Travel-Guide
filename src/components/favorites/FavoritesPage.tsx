import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  findEventByTitle,
  findFoodById,
  findSouvenirById,
  findSpotByName,
  FOOD_BY_REGION,
} from '../../data/index'
import type { FavType } from '../../data/types'
import { useFavorites } from '../../hooks/useFavorites'
import FavCard from './FavCard'

interface TabConfigItem {
  label: string
  emptyIcon: string
  emptyText: string
  emptyBtn: string
  anchor: string
}

const TAB_CONFIG: Record<FavType, TabConfigItem> = {
  spots: {
    label: '地点',
    emptyIcon: 'favorite_border',
    emptyText: '你还没有收藏任何地点。浏览「七大目的地」，点击景点卡片右上角的心形按钮，把心仪之地收藏起来吧。',
    emptyBtn: '去发现景点',
    anchor: 'destinations',
  },
  foods: {
    label: '美食',
    emptyIcon: 'restaurant',
    emptyText: '你还没有收藏任何美食。前往「舌尖上的日本」，点击菜品卡片右上角的心形按钮，收藏想尝的味道吧。',
    emptyBtn: '去发现美食',
    anchor: 'food',
  },
  souvenirs: {
    label: '纪念品',
    emptyIcon: 'redeem',
    emptyText: '你还没有收藏任何纪念品。逛逛「纪念品与购物清单」，点击卡片右上角的心形按钮，收藏心仪好物吧。',
    emptyBtn: '去发现好物',
    anchor: 'souvenir',
  },
  events: {
    label: '活动',
    emptyIcon: 'celebration',
    emptyText: '你还没有收藏任何活动。到「当地活动 · 节日与祭典」看看，把心仪的祭典收藏起来，让旅行踩着日本的季节节拍出发。',
    emptyBtn: '去发现活动',
    anchor: 'events',
  },
}

interface EmptyStateProps {
  icon: string
  text: string
  buttonText: string
  onJump: () => void
}

function EmptyState({ icon, text, buttonText, onJump }: EmptyStateProps) {
  return (
    <div className="text-center py-16 border hairline rounded-3xl bg-card">
      <div className="w-16 h-16 rounded-full bg-paper grid place-items-center mx-auto mb-5 border hairline">
        <span className="material-symbols-outlined text-terracotta text-3xl">{icon}</span>
      </div>
      <p className="text-ink/70 leading-8 max-w-md mx-auto px-6 text-[15px]">{text}</p>
      <button
        type="button"
        onClick={onJump}
        className="mt-6 inline-flex btn-primary px-6 py-3 rounded-full items-center gap-2 font-semibold text-[13px]"
      >
        <span className="text-[16px]">🧭</span>
        {buttonText}
      </button>
    </div>
  )
}

interface FavCardEntry {
  key: string
  type: FavType
  id: string
  title: string
  subtitle?: string
  description?: string
  imageSrc?: string
  tag: string
  meta?: string
  price?: string
  open: () => void
}

export interface FavoritesPageProps {
  onOpenSpot: (name: string) => void
  onOpenFood: (id: string) => void
  onOpenSouvenir: (id: string) => void
  onOpenEvent: (title: string) => void
}

export default function FavoritesPage({
  onOpenSpot,
  onOpenFood,
  onOpenSouvenir,
  onOpenEvent,
}: FavoritesPageProps) {
  const navigate = useNavigate()
  const { favorites, counts } = useFavorites()
  const [activeTab, setActiveTab] = useState<FavType>('spots')

  const itemsByTab = useMemo<Record<FavType, FavCardEntry[]>>(() => {
    const spots: FavCardEntry[] = favorites.spots
      .map((name): FavCardEntry | null => {
        const hit = findSpotByName(name)
        if (!hit) return null
        return {
          key: `spot-${name}`,
          type: 'spots',
          id: name,
          title: hit.spot.name,
          subtitle: hit.spot.jp,
          description: hit.spot.desc,
          imageSrc: `/images/${hit.spot.img}`,
          tag: `${hit.region.name} · ${hit.spot.tag}`,
          meta: `${hit.spot.ticket ?? ''} · ${hit.spot.hours ?? ''}`,
          open: () => onOpenSpot(name),
        }
      })
      .filter((entry): entry is FavCardEntry => entry !== null)

    const foods: FavCardEntry[] = favorites.foods
      .map((foodId): FavCardEntry | null => {
        const hit = findFoodById(foodId)
        if (!hit) return null
        return {
          key: `food-${foodId}`,
          type: 'foods',
          id: foodId,
          title: hit.item.title,
          description: hit.item.desc,
          imageSrc: `/images/${FOOD_BY_REGION[hit.region.id].img}`,
          tag: `${hit.region.name} · 名物`,
          meta: `${(hit.item.shops || []).length} 家推荐餐厅`,
          open: () => onOpenFood(foodId),
        }
      })
      .filter((entry): entry is FavCardEntry => entry !== null)

    const souvenirs: FavCardEntry[] = favorites.souvenirs
      .map((souvenirId): FavCardEntry | null => {
        const item = findSouvenirById(souvenirId)
        if (!item) return null
        return {
          key: `souvenir-${souvenirId}`,
          type: 'souvenirs',
          id: souvenirId,
          title: item.name,
          description: item.short,
          imageSrc: `/images/sv_${item.img}.jpg`,
          tag: `${item.cat} · ${item.tag}`,
          price: item.jpy.split('（').shift(),
          meta: `${item.cny} 人民币`,
          open: () => onOpenSouvenir(souvenirId),
        }
      })
      .filter((entry): entry is FavCardEntry => entry !== null)

    const events: FavCardEntry[] = favorites.events
      .map((title): FavCardEntry | null => {
        const hit = findEventByTitle(title)
        if (!hit) return null
        const regionName = hit.region?.name ?? ''
        return {
          key: `event-${title}`,
          type: 'events',
          id: title,
          title: hit.event.title,
          subtitle: hit.event.jp,
          description: hit.event.desc,
          imageSrc: `/images/${hit.event.img}`,
          tag: `${regionName} · ${hit.event.tag || '祭典'}`,
          meta: `${hit.event.date || ''} · ${hit.event.place || ''}`,
          open: () => onOpenEvent(title),
        }
      })
      .filter((entry): entry is FavCardEntry => entry !== null)

    return { spots, foods, souvenirs, events }
  }, [favorites, onOpenEvent, onOpenFood, onOpenSouvenir, onOpenSpot])

  useEffect(() => {
    const order: FavType[] = ['spots', 'foods', 'souvenirs', 'events']
    if ((itemsByTab[activeTab] || []).length > 0) return
    const next = order.find((key) => (itemsByTab[key] || []).length > 0) || 'spots'
    setActiveTab(next)
  }, [activeTab, itemsByTab])

  const currentItems = itemsByTab[activeTab] || []
  const currentConfig = TAB_CONFIG[activeTab]

  const statCards: Array<[string, string, number]> = [
    ['目的地', '地点', counts.spots],
    ['美食', '美食', counts.foods],
    ['纪念品', '纪念品', counts.souvenirs],
    ['活动', '活动', counts.events],
  ]

  return (
    <main className="pt-16 bg-paper min-h-screen">
      <section className="py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="max-w-3xl mb-10 reveal show">
            <div className="flex items-center gap-3 mb-5">
              <span className="section-num">— 09</span>
              <span className="eyebrow">我的收藏</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black serif leading-tight">我的收藏 · 旅行心愿单</h1>
            <div className="section-rule mt-6 mb-5" />
            <p className="text-ink/65 leading-8 text-[15px]">
              收藏保存在浏览器本地，同一浏览器随时可查阅；清除浏览器数据会同时清除收藏。你可以在主页继续点击心形按钮添加或取消地点、美食、纪念品与活动。
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {statCards.map(([en, cn, count]) => (
              <div key={en} className="fav-stat-card bg-card rounded-2xl border hairline p-6 shadow-sm transition-transform">
                <p className="eyebrow mb-3">{en}</p>
                <div className="flex items-end justify-between">
                  <span className="text-ink/60 font-semibold">{cn}</span>
                  <strong className="serif text-5xl text-terracotta transition-transform">{count}</strong>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2.5 mb-10">
            {(Object.entries(TAB_CONFIG) as Array<[FavType, TabConfigItem]>).map(([key, config]) => {
              const active = key === activeTab
              const count = counts[key]
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveTab(key)}
                  className={`fav-tab tab-btn whitespace-nowrap px-6 py-2.5 rounded-full text-[13.5px] font-semibold border transition-all ${
                    active
                      ? 'fav-tab-active bg-pine text-white border-pine shadow-md'
                      : 'bg-card text-ink/75 border-black/10 hover:border-pine hover:text-pine'
                  }`}
                >
                  {config.label}
                  <span className="fav-badge ml-1 inline-grid place-items-center min-w-5 h-5 px-1.5 rounded-full text-[11px] font-bold align-middle">
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          {currentItems.length ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {currentItems.map((item) => (
                <FavCard
                  key={item.key}
                  type={item.type}
                  id={item.id}
                  title={item.title}
                  subtitle={item.subtitle}
                  description={item.description}
                  imageSrc={item.imageSrc}
                  tag={item.tag}
                  meta={item.meta}
                  price={item.price}
                  onOpen={item.open}
                  variant={item.type === 'foods' ? 'text' : 'image'}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={currentConfig.emptyIcon}
              text={currentConfig.emptyText}
              buttonText={currentConfig.emptyBtn}
              onJump={() => navigate(`/?section=${currentConfig.anchor}`)}
            />
          )}
        </div>
      </section>
    </main>
  )
}
