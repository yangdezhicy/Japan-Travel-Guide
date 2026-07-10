import { useEffect, useMemo, useState } from 'react'

type CityWeather = {
  city: string
  icon: string
  temp: string
  best: string
  note: string
}

type RouteOption = {
  id: string
  label: string
  fare: number
}

const JPY_TO_CNY = 0.0418
const TAX_RATE = 0.1
const JR_PASS_7_DAYS = 70000

const WEATHER_CARDS: CityWeather[] = [
  { city: '东京', icon: 'wb_sunny', temp: '夏 24-32℃ · 冬 3-11℃', best: '3-5月 / 10-11月', note: '市区步行多，晴雨伞和舒适鞋最重要。' },
  { city: '京都', icon: 'temple_buddhist', temp: '夏湿热 · 冬早晚冷', best: '樱花 / 红叶季', note: '寺社多为户外，建议早出避开人流。' },
  { city: '大阪', icon: 'nightlife', temp: '夏 25-33℃ · 冬 4-12℃', best: '全年适合', note: '夜间美食和购物丰富，留足晚间体力。' },
  { city: '北海道', icon: 'ac_unit', temp: '夏凉爽 · 冬严寒', best: '6-8月 / 12-2月', note: '冬季务必准备防滑鞋、手套和保暖外套。' },
]

const ROUTES: RouteOption[] = [
  { id: 'tokyo-kyoto', label: '东京 ⇄ 京都 新干线', fare: 28000 },
  { id: 'tokyo-osaka', label: '东京 ⇄ 大阪 新干线', fare: 29200 },
  { id: 'kyoto-osaka', label: '京都 ⇄ 大阪 JR/私铁', fare: 1160 },
  { id: 'osaka-hiroshima', label: '大阪 ⇄ 广岛 新干线', fare: 21400 },
  { id: 'tokyo-nikko', label: '东京 ⇄ 日光 往返', fare: 6000 },
]

const VJW_STEPS = [
  '确认护照有效期、签证与机票酒店信息',
  '注册入境手续系统账号并录入旅客信息',
  '填写入境审查与海关申报，生成二维码',
  '截图保存二维码，并准备酒店英文/日文地址',
  '出发前检查 eSIM、交通卡、保险与常备药',
]

function formatJPY(value: number) {
  return `¥${Math.round(value).toLocaleString('ja-JP')}`
}

function formatCNY(value: number) {
  return `约 ¥${Math.round(value).toLocaleString('zh-CN')} 人民币`
}

export default function TravelTools() {
  const [jpy, setJpy] = useState(10000)
  const [taxPrice, setTaxPrice] = useState(5500)
  const [selectedRoutes, setSelectedRoutes] = useState<string[]>(['tokyo-kyoto', 'tokyo-osaka'])
  const [checked, setChecked] = useState<string[]>(() => {
    try {
      return JSON.parse(window.localStorage.getItem('jp_vjw_checklist') || '[]') as string[]
    } catch (err) {
      void err
      return []
    }
  })
  const [allergy, setAllergy] = useState('海鲜 / 甲壳类')

  useEffect(() => {
    try {
      window.localStorage.setItem('jp_vjw_checklist', JSON.stringify(checked))
    } catch (err) {
      void err
    }
  }, [checked])

  const routeTotal = useMemo(
    () => ROUTES.filter((route) => selectedRoutes.includes(route.id)).reduce((sum, route) => sum + route.fare, 0),
    [selectedRoutes],
  )

  const passDiff = routeTotal - JR_PASS_7_DAYS
  const taxFreePrice = Math.round(taxPrice / (1 + TAX_RATE))

  const toggleRoute = (id: string) => {
    setSelectedRoutes((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const toggleStep = (step: string) => {
    setChecked((prev) => (prev.includes(step) ? prev.filter((item) => item !== step) : [...prev, step]))
  }

  return (
    <section id="tools" className="relative py-16 md:py-20 bg-white overflow-hidden">
      <div className="hidden absolute -top-28 -right-24 w-72 h-72 rounded-full bg-terracotta/10 blur-3xl" />
      <div className="hidden absolute bottom-12 -left-24 w-72 h-72 rounded-full bg-pine/10 blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-6 md:px-10">
        <div className="max-w-3xl mb-10 reveal show">
          <div className="flex items-center gap-3 mb-5">
            <span className="section-num">— 07</span>
            <span className="eyebrow">旅行工具</span>
          </div>
          <h2 className="text-[clamp(2rem,7vw,3.25rem)] font-black serif leading-tight">旅行工具箱 · 边查边规划</h2>
          <div className="section-rule mt-6 mb-5" />
          <p className="text-ink/65 leading-8 text-[15px]">
            参考主流旅行网站的行程、票券、入境清单与预算能力，做成无需登录、可离线记忆的轻量工具。
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 grid md:grid-cols-2 gap-5">
            <div className="tool-card bg-card rounded-3xl border hairline p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3 mb-5">
                <div>
                  <p className="eyebrow text-pine">汇率换算</p>
                  <h3 className="serif font-black text-xl mt-1">日元 / 人民币换算</h3>
                </div>
                <span className="text-terracotta text-3xl font-black">¥</span>
              </div>
              <label className="text-[12px] font-bold text-ink/55">输入日元金额</label>
              <input
                type="number"
                min="0"
                value={jpy}
                onChange={(event) => setJpy(Number(event.target.value || 0))}
                className="mt-2 w-full rounded-2xl border hairline bg-paper px-4 py-3 outline-none focus:border-pine"
              />
              <div className="mt-5 rounded-2xl bg-pine/6 p-4">
                <p className="text-3xl serif font-black text-pine">{formatCNY(jpy * JPY_TO_CNY)}</p>
                <p className="text-[12px] text-ink/45 mt-2">按 100 日元≈4.18 元估算，实际以银行/支付平台结算为准。</p>
              </div>
            </div>

            <div className="tool-card bg-card rounded-3xl border hairline p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3 mb-5">
                <div>
                  <p className="eyebrow text-pine">免税估算</p>
                  <h3 className="serif font-black text-xl mt-1">退税实付估算</h3>
                </div>
                <span className="text-terracotta text-2xl">🧾</span>
              </div>
              <label className="text-[12px] font-bold text-ink/55">含税标价（日元）</label>
              <input
                type="number"
                min="0"
                value={taxPrice}
                onChange={(event) => setTaxPrice(Number(event.target.value || 0))}
                className="mt-2 w-full rounded-2xl border hairline bg-paper px-4 py-3 outline-none focus:border-pine"
              />
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-paper p-4">
                  <p className="text-[12px] text-ink/50">免税后约</p>
                  <p className="serif font-black text-xl text-pine mt-1">{formatJPY(taxFreePrice)}</p>
                </div>
                <div className="rounded-2xl bg-paper p-4">
                  <p className="text-[12px] text-ink/50">节省约</p>
                  <p className="serif font-black text-xl text-terracotta mt-1">{formatJPY(taxPrice - taxFreePrice)}</p>
                </div>
              </div>
            </div>

            <div className="tool-card md:col-span-2 bg-card rounded-3xl border hairline p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
                <div>
                  <p className="eyebrow text-pine">交通试算</p>
                  <h3 className="serif font-black text-xl mt-1">JR Pass 7 日券盈亏试算</h3>
                </div>
                <div className="rounded-full bg-ink text-white px-4 py-2 text-[12px] font-bold">全国版参考 {formatJPY(JR_PASS_7_DAYS)}</div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {ROUTES.map((route) => (
                  <button
                    key={route.id}
                    type="button"
                    onClick={() => toggleRoute(route.id)}
                    className={`min-h-[54px] rounded-2xl border px-4 py-3 text-left transition ${selectedRoutes.includes(route.id) ? 'bg-pine text-white border-pine shadow-md' : 'bg-paper border-black/10 hover:border-pine'}`}
                  >
                    <span className="block text-[13px] font-bold">{route.label}</span>
                    <span className="block text-[12px] opacity-70 mt-1">参考往返 {formatJPY(route.fare)}</span>
                  </button>
                ))}
              </div>
              <div className="mt-5 rounded-2xl bg-terracotta/6 border border-terracotta/15 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <p className="text-[12px] text-ink/55">已选线路合计</p>
                  <p className="serif text-2xl font-black text-ink mt-1">{formatJPY(routeTotal)}</p>
                </div>
                <p className={`font-bold ${passDiff >= 0 ? 'text-pine' : 'text-terracotta'}`}>
                  {passDiff >= 0 ? `可能省 ${formatJPY(passDiff)}` : `单买约省 ${formatJPY(Math.abs(passDiff))}`}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="tool-card bg-ink text-white rounded-3xl p-6 shadow-sm">
              <p className="eyebrow-light">入境清单</p>
              <h3 className="serif font-black text-xl mt-1 mb-5">入境清单</h3>
              <div className="space-y-3">
                {VJW_STEPS.map((step) => {
                  const active = checked.includes(step)
                  return (
                    <button key={step} type="button" onClick={() => toggleStep(step)} className="w-full flex items-start gap-3 text-left min-h-[44px]">
                      <span className={`mt-0.5 w-5 h-5 rounded-full border grid place-items-center shrink-0 ${active ? 'bg-terracotta border-terracotta' : 'border-white/30'}`}>
                        {active ? <span className="text-[12px]">✓</span> : null}
                      </span>
                      <span className={`text-[13px] leading-6 ${active ? 'text-white/45 line-through' : 'text-white/82'}`}>{step}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="tool-card bg-card rounded-3xl border hairline p-6 shadow-sm">
              <p className="eyebrow text-pine">求助卡</p>
              <h3 className="serif font-black text-xl mt-1 mb-4">日语求助卡</h3>
              <input value={allergy} onChange={(event) => setAllergy(event.target.value)} className="w-full rounded-2xl bg-paper border hairline px-4 py-3 outline-none focus:border-pine" />
              <div className="mt-4 rounded-2xl bg-paper p-4 text-[13px] leading-7">
                <p className="font-bold text-ink">私は {allergy || '＿＿'} にアレルギーがあります。</p>
                <p className="text-ink/58 mt-1">我对「{allergy || '请填写过敏源'}」过敏，请帮我确认餐食是否包含。</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          {WEATHER_CARDS.map((item) => (
            <div key={item.city} className="bg-card rounded-3xl border hairline p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h4 className="serif font-black text-lg">{item.city}</h4>
                <span className="material-symbols-outlined text-pine">{item.icon}</span>
              </div>
              <p className="text-[12px] font-bold text-terracotta">最佳：{item.best}</p>
              <p className="text-[12.5px] text-ink/65 mt-2">{item.temp}</p>
              <p className="text-[12.5px] text-ink/50 leading-6 mt-2">{item.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
