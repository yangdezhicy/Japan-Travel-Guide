import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { SOUVENIRS } from '../data/index'
import {
  SHOPPING_CATEGORY_META,
  SHOPPING_CATEGORY_ORDER,
  SHOPPING_DISTRICTS,
  SHOPPING_TOP50_IDS,
} from '../data/shoppingData'
import {
  EXTRA_SHOPPING_CATEGORY_META,
  EXTRA_SHOPPING_CATEGORY_ORDER,
  EXTRA_TOP_SHOPPING_IDS,
} from '../data/extraShoppingData'
import type { ShoppingCategoryMeta, Souvenir, SouvenirCategory } from '../data/types'
import Modal from '../components/common/Modal'
import { SouvenirDetailContent } from '../components/common/DetailPanels'
import SectionHeader from '../components/common/SectionHeader'
import ZoomImg from '../components/common/ZoomImg'
import { DistrictCard, SouvenirCard } from '../components/shopping/ShoppingCards'

interface TipCard {
  icon: string
  title: string
  steps: string[]
}

const SHOPPING_TIPS: TipCard[] = [
  {
    icon: 'sell',
    title: '免税购物',
    steps: ['同店同日一般满 5,000 日元可办免税', '结账时主动出示护照', '药妆 + 零食经常能叠加店铺券', '消耗品封袋后尽量别拆，离境前一起带走'],
  },
  {
    icon: 'receipt_long',
    title: '商圈扫货顺序',
    steps: ['先逛百货试色试香再定清单', '药妆和 Donki 负责补货型单品', '最后一站留给东京站 / 机场补伴手礼', '大件家电尽量放在旅程后半段购买'],
  },
  {
    icon: 'payments',
    title: '结账方式',
    steps: ['主流百货和电器店支持银联 / Visa / 支付宝', '小市场和老铺建议备一点现金', '同品牌不同店常有不同赠品和积分活动', '热门商圈周末排队久，尽量错峰'],
  },
  {
    icon: 'inventory_2',
    title: '打包建议',
    steps: ['生巧、芝士蛋糕优先最后一天再买', '酒类、护肤品液体建议托运', '陶器和玻璃杯一定要让店员多包一层', '箱包和衣服适合先买，回程还能拿来装货'],
  },
]

const SHOPPING_CATEGORY_LIST = [...SHOPPING_CATEGORY_ORDER, ...EXTRA_SHOPPING_CATEGORY_ORDER]
const SHOPPING_META = { ...SHOPPING_CATEGORY_META, ...EXTRA_SHOPPING_CATEGORY_META } as Record<SouvenirCategory, ShoppingCategoryMeta>
const SHOPPING_RANKING_IDS = [...SHOPPING_TOP50_IDS, ...EXTRA_TOP_SHOPPING_IDS]

export default function Shopping() {
  const [souvenirId, setSouvenirId] = useState<string>('')
  const [activeCat, setActiveCat] = useState<SouvenirCategory>(SHOPPING_CATEGORY_ORDER[0])

  const top50Items = useMemo(
    () =>
      SHOPPING_RANKING_IDS.map((id) => SOUVENIRS.find((item) => item.id === id)).filter(
        (item): item is Souvenir => Boolean(item),
      ),
    [],
  )

  const top12Items = top50Items.slice(0, 12)

  const categoryCounts = useMemo(
    () =>
      SOUVENIRS.reduce<Record<string, number>>((acc, item) => {
        acc[item.cat] = (acc[item.cat] || 0) + 1
        return acc
      }, {}),
    [],
  )

  const categories = useMemo(
    () => SHOPPING_CATEGORY_LIST.filter((cat) => categoryCounts[cat]),
    [categoryCounts],
  )

  const activeMeta = SHOPPING_META[activeCat]

  const catItems = useMemo(
    () =>
      SOUVENIRS.filter((item) => item.cat === activeCat).sort((a, b) => {
        const rankA = SHOPPING_RANKING_IDS.indexOf(a.id)
        const rankB = SHOPPING_RANKING_IDS.indexOf(b.id)
        if (rankA !== -1 && rankB !== -1) return rankA - rankB
        if (rankA !== -1) return -1
        if (rankB !== -1) return 1
        return (b.rating ?? 0) - (a.rating ?? 0) || a.name.localeCompare(b.name, 'zh-CN')
      }),
    [activeCat],
  )

  return (
    <main className="pt-16 bg-paper min-h-screen">
      <section className="relative overflow-hidden" style={{ minHeight: 380 }}>
        <ZoomImg src="/images/tokyo_shibuya.jpg" alt="日本购物指南" className="absolute inset-0 w-full h-full object-cover" disabled />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/94 via-ink/90 to-ink/98" />
        <div className="relative max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-24 drop-shadow-[0_2px_18px_rgba(45,36,32,0.36)]">
          <span className="eyebrow-light">Trend Shopping · Japan Price Gap</span>
          <h1 className="text-white text-[clamp(2.8rem,8vw,6rem)] font-black serif mt-4 leading-[.94] tracking-[-.06em]">
            日本购物
            <br />
            热门价差清单
          </h1>
          <div className="section-rule-light mt-6 mb-6" />
          <p className="text-white/95 max-w-3xl leading-8 text-[15px]">
            这次把榜单重排为“日本便宜、国内更贵/更难买”的热门价差逻辑：奢侈品包袋、中古精品、日系珠宝、潮鞋、美容仪和药妆都放到前排。
            覆盖 {SOUVENIRS.length} 件日本高频好物，适合边比价边收藏；所有价格以门店实时标价、退税规则和汇率为准。
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 max-w-4xl">
            {[
              ['完整商品池', `${SOUVENIRS.length} 件`],
              ['分类数量', `${categories.length} 类`],
              ['Top 榜单', 'Top 78'],
              ['必逛商圈', `${SHOPPING_DISTRICTS.length} 处`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/20 bg-ink/34 backdrop-blur-md p-4 shadow-[0_16px_36px_-24px_rgba(0,0,0,0.75)]">
                <p className="text-white/76 text-[11px] tracking-[.2em] uppercase">{label}</p>
                <p className="text-white serif font-black text-2xl mt-2">{value}</p>
              </div>
            ))}
          </div>
          <p className="text-white/78 text-[12.5px] mt-5">
            参考汇率：100 日元 ≈ 4.18 元人民币（2026-07）。页面价格为公开参考区间，实际请以门店标价、免税规则与活动为准。
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <SectionHeader
            index="01"
            eyebrow="Editor&apos;s Picks"
            title="Top 12 精选大卡"
            desc="Top 12 是 Top 50 的前排子集，先把最值得优先买的十二件拎出来，适合第一次去日本直接照着冲。"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mt-10">
            {top12Items.map((item, index) => (
              <SouvenirCard key={item.id} item={item} rank={index} featured onOpen={setSouvenirId} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-card">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <SectionHeader
            index="02"
            eyebrow="Top 78 Ranking"
            title="Top 78 完整榜单"
            desc="按真实策展顺序排好，从高频回购护肤、经典药妆零食，到运动休闲、服装、电子产品、奢侈品、时尚饰品和彩妆全部收录。"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-10">
            {top50Items.map((item, index) => (
              <SouvenirCard key={item.id} item={item} rank={index} onOpen={setSouvenirId} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <SectionHeader
            index="03"
            eyebrow="Browse by Category"
            title="分类逛好物 · 27 类"
            desc="按场景来逛最省脑：护肤、零食、家电、运动休闲、服装、电子产品、奢侈品、药品、饰品和彩妆都拆开了，切分类时不会空洞。"
          />
          <div className="bg-card rounded-3xl border hairline p-6 md:p-7 mt-10">
            <div className="flex flex-wrap gap-2.5">
              {categories.map((cat) => {
                const active = cat === activeCat
                const count = categoryCounts[cat] || 0
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCat(cat)}
                    className={`whitespace-nowrap px-4 py-2.5 rounded-full text-[13.5px] font-semibold border transition-all inline-flex items-center gap-1.5 ${
                      active
                        ? 'bg-pine text-white border-pine shadow-md'
                        : 'bg-paper text-ink/75 border-black/10 hover:border-pine hover:text-pine'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{SHOPPING_META[cat].icon}</span>
                    {cat}
                    <span className="ml-0.5 inline-grid place-items-center min-w-5 h-5 px-1.5 rounded-full text-[11px] font-bold bg-black/5">
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
            <div className="mt-6 rounded-2xl bg-pine/5 border border-pine/15 p-5 md:p-6">
              <div className="flex items-center gap-2 text-pine mb-2">
                <span className="material-symbols-outlined">{activeMeta.icon}</span>
                <h4 className="serif font-bold text-[17px] text-ink">{activeCat}</h4>
              </div>
              <p className="text-[13px] text-ink/70 leading-7">{activeMeta.blurb}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mt-8">
              {catItems.map((item) => (
                <SouvenirCard key={item.id} item={item} onOpen={setSouvenirId} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-card">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <SectionHeader
            index="04"
            eyebrow="Shopping Tips"
            title="逛街顺序 · 免税 · 打包攻略"
            desc="把容易踩坑的地方先讲清楚，实际逛起来会轻松很多。"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
            {SHOPPING_TIPS.map((tip) => (
              <div key={tip.title} className="bg-paper rounded-2xl border hairline p-6">
                <div className="flex items-center gap-2 text-pine mb-4">
                  <span className="material-symbols-outlined">{tip.icon}</span>
                  <h4 className="serif font-bold text-[16px] text-ink">{tip.title}</h4>
                </div>
                <ul className="space-y-2.5">
                  {tip.steps.map((step, index) => (
                    <li key={step} className="flex items-start gap-2 text-[13px] text-ink/72 leading-6">
                      <span className="shrink-0 mt-0.5 w-4 h-4 rounded-full bg-pine/10 text-pine grid place-items-center text-[10px] font-bold">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <SectionHeader
            index="05"
            eyebrow="Where to Shop"
            title="必逛购物商圈"
            desc="补齐了营业时间、地址和地图跳转。逛百货、扫药妆、买二次元、冲机场伴手礼，都能快速找入口。"
          />
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5 mt-10">
            {SHOPPING_DISTRICTS.map((district) => (
              <DistrictCard key={district.id} district={district} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-card">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="bg-pine/5 border border-pine/20 rounded-3xl p-8 md:p-12 text-center">
            <span className="material-symbols-outlined text-terracotta text-4xl">favorite</span>
            <h3 className="serif font-black text-2xl md:text-3xl text-ink mt-3">把心仪好物先收藏进清单</h3>
            <p className="text-ink/65 leading-8 text-[14.5px] max-w-2xl mx-auto mt-3">
              右上角爱心会直接把商品加入「我的收藏」，无论你是在做送礼清单、比价清单，还是回国前最后补货清单，都很方便。
            </p>
            <Link
              to="/favorites"
              className="mt-6 inline-flex btn-primary px-7 py-3.5 rounded-full items-center gap-2 font-semibold text-[14px]"
            >
              <span className="material-symbols-outlined text-[20px]">redeem</span>
              查看已收藏的纪念品
            </Link>
          </div>
        </div>
      </section>

      <Modal
        id="shopping-sv-modal"
        open={Boolean(souvenirId)}
        onClose={() => setSouvenirId('')}
        maxWidth="md:max-w-4xl"
        innerClassName="overflow-hidden"
      >
        <SouvenirDetailContent souvenirId={souvenirId} onClose={() => setSouvenirId('')} />
      </Modal>
    </main>
  )
}
