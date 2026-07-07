/* 日本旅游 AI 小助手推理引擎：意图识别 + 槽位抽取 + 多轮上下文 + 站内数据联动。
 * 纯前端本地推理，不依赖任何后端/API，基于站内真实景点/美食/购物/季节/活动数据动态生成回答。 */
import {
  REGIONS,
  FOOD_BY_REGION,
  SOUVENIRS,
  SEASON_DETAILS,
  LOCAL_EVENTS,
  SPOT_DETAILS,
} from '../data'
import { SHOPPING_DISTRICTS } from '../data/shoppingData'
import type { RegionId, SeasonKey, Souvenir, SouvenirCategory } from '../data/types'
import { TRAVEL_KNOWLEDGE_BASE, type KnowledgeEntry } from '../data/travelKnowledgeBase'

export type Intent =
  | 'greeting'
  | 'itinerary'
  | 'spot'
  | 'food'
  | 'shopping'
  | 'drugstore'
  | 'electronics'
  | 'luxury'
  | 'season'
  | 'transport'
  | 'budget'
  | 'event'
  | 'district'
  | 'knowledge'
  | 'unknown'

export type BudgetLevel = 'low' | 'mid' | 'high'
export type Companion = 'family' | 'elder' | 'couple' | 'friends' | 'solo'

export interface AssistantSlots {
  region: RegionId | null
  days: number | null
  budget: BudgetLevel | null
  companion: Companion | null
  season: SeasonKey | null
  category: SouvenirCategory | null
}

export interface AssistantContext {
  slots: AssistantSlots
  lastIntent: Intent | null
}

export interface AssistantCard {
  title: string
  subtitle?: string
  meta?: string
  href?: string
}

export interface AssistantReply {
  text: string
  bullets: string[]
  chips: string[]
  sources: string[]
  cards?: AssistantCard[]
}

export function createInitialContext(): AssistantContext {
  return {
    slots: { region: null, days: null, budget: null, companion: null, season: null, category: null },
    lastIntent: null,
  }
}

/* ----------------------------- 关键词词典 ----------------------------- */

const REGION_KEYWORDS: Record<RegionId, string[]> = {
  tokyo: ['东京', '浅草', '涩谷', '新宿', '银座', '秋叶原', '台场', '晴空塔', '镰仓', '原宿', '迪士尼', 'tokyo', 'teamlab'],
  kyoto: ['京都', '清水寺', '伏见', '稻荷', '金阁', '岚山', '祇园', '宇治', '哲学之道', 'kyoto'],
  osaka: ['大阪', '道顿堀', '心斋桥', '环球影城', 'usj', '黑门', '难波', '通天阁', 'osaka'],
  fuji: ['富士', '箱根', '河口湖', 'fuji', 'hakone'],
  nara: ['奈良', '喂鹿', '小鹿', '东大寺', '春日大社', 'nara'],
  hokkaido: ['北海道', '札幌', '小樽', '富良野', '函馆', '美瑛', '薰衣草', 'hokkaido', 'sapporo'],
  okinawa: ['冲绳', '首里', '美之海', '古宇利', '那霸', '国际通', 'okinawa'],
}

const SEASON_KEYWORDS: Record<SeasonKey, string[]> = {
  spring: ['春', '樱花', '赏樱', '3月', '4月', '三月', '四月'],
  summer: ['夏', '花火', '祭典', '海岛', '海边', '避暑', '7月', '8月', '七月', '八月'],
  autumn: ['秋', '红叶', '枫叶', '赏枫', '10月', '11月', '十月', '十一月'],
  winter: ['冬', '雪', '滑雪', '雪景', '12月', '1月', '2月', '十二月', '一月', '二月'],
}

const BUDGET_KEYWORDS: Record<BudgetLevel, string[]> = {
  low: ['省钱', '便宜', '穷游', '学生', '划算', '平价', '预算有限', '预算少', '穷'],
  high: ['高端', '贵妇', '豪华', '奢华', '预算充足', '不差钱', '高品质', '高预算'],
  mid: ['中等预算', '预算适中', '一般预算'],
}

const COMPANION_KEYWORDS: Record<Companion, string[]> = {
  family: ['亲子', '带娃', '孩子', '小孩', '宝宝', '一家', '带娃儿', '带孩子'],
  elder: ['长辈', '父母', '爸妈', '妈妈', '爸爸', '老人', '老爸', '老妈', '带老人'],
  couple: ['情侣', '蜜月', '男朋友', '女朋友', '对象', '两个人', '二人'],
  friends: ['闺蜜', '朋友', '同学', '姐妹', '同事'],
  solo: ['一个人', '独自', '独游', '单独', '独旅'],
}

const CATEGORY_KEYWORDS: Partial<Record<SouvenirCategory, string[]>> = {
  彩妆美妆: ['彩妆', '化妆品', '口红', '眼影', '腮红', '睫毛膏'],
  防晒隔离: ['防晒', '隔离'],
  护肤精华: ['护肤', '精华', '面霜', '化妆水'],
  面膜清洁: ['面膜', '洗面奶', '清洁'],
  保健药品: ['保健', '维生素', '钙片'],
  药品常备: ['常备药', '感冒药', '胃药', '眼药水', '贴布', '止痛'],
  电子产品: ['相机', '耳机', '镜头', '游戏机', '数码'],
  个护电器: ['吹风机', '美容仪', '卷发棒', '直发'],
  奢侈品: ['奢侈品', '名牌', '中古', '腕表', '名表'],
  运动休闲: ['运动', '球鞋', '跑鞋', '潮鞋', '休闲'],
  服装穿搭: ['服装', '穿搭', '衣服', '外套'],
  时尚饰品: ['饰品', '眼镜', '香水', '配饰'],
  伴手礼限定: ['伴手礼', '手信', '限定', '零食', '巧克力'],
  文具手账: ['文具', '手账', '笔'],
  '动漫手办': ['手办', '模型', '高达'],
  'IP 周边': ['周边', 'ip', '玩偶', '公仔'],
}

const INTENT_KEYWORDS: Record<Exclude<Intent, 'greeting' | 'knowledge' | 'unknown'>, string[]> = {
  itinerary: ['行程', '几天', '怎么安排', '怎么玩', '规划', '路线', '第一次', '玩几天', '天怎么', '安排', '攻略'],
  spot: ['景点', '必去', '打卡', '好玩', '去哪玩', '看什么', '推荐地方', '值得去', '景色', '玩什么'],
  food: ['美食', '吃', '餐厅', '好吃', '拉面', '寿司', '章鱼烧', '吃什么', '小吃', '料理'],
  shopping: ['购物', '必买', '清单', '带什么', '伴手礼', '纪念品', '好物', 'shopping', '买什么', '买点'],
  drugstore: ['药妆', '防晒', '护肤', '面膜', '化妆品', '感冒药', '胃药', '眼药水', '常备药'],
  electronics: ['电子', '相机', '耳机', '电器', '吹风机', '美容仪', '游戏机', '镜头', '数码'],
  luxury: ['奢侈', '中古', '名牌', '腕表', '二手', '包包', '名表'],
  season: ['季节', '什么时候', '几月', '最佳时间', '天气', '适合去'],
  transport: ['交通', '地铁', 'jr', '西瓜卡', 'suica', 'icoca', '新干线', '怎么去', '机场', '通票', '巴士', 'jrpass'],
  budget: ['预算', '花多少', '多少钱', '费用', '花费', '开销', '人均'],
  event: ['活动', '祭', '花火', '庆典', '节日', '祭典'],
  district: ['商圈', '去哪买', '哪里买', '购物街', '商店街', '免税店'],
}

const INTENT_PRIORITY: Intent[] = [
  'drugstore', 'electronics', 'luxury', 'transport', 'budget', 'season',
  'event', 'district', 'food', 'shopping', 'spot', 'itinerary',
]

const GREETING_KEYWORDS = ['你好', '您好', 'hi', 'hello', '在吗', '你是谁', '能做什么', '帮助', '怎么用', '哈喽']

/* ----------------------------- 工具函数 ----------------------------- */

const CN_NUM: Record<string, number> = { 一: 1, 二: 2, 两: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9, 十: 10 }

function regionName(id: RegionId): string {
  return REGIONS.find((r) => r.id === id)?.name ?? id
}

function detectRegion(text: string): RegionId | null {
  for (const region of REGIONS) {
    const keys = REGION_KEYWORDS[region.id]
    if (keys.some((k) => text.includes(k))) return region.id
  }
  return null
}

function detectDays(text: string): number | null {
  const arabic = text.match(/(\d+)\s*(天|日|day)/i)
  if (arabic) {
    const n = Number(arabic[1])
    if (n > 0 && n < 60) return n
  }
  const cn = text.match(/([一二两三四五六七八九十])\s*(天|日)/)
  if (cn && CN_NUM[cn[1]]) return CN_NUM[cn[1]]
  return null
}

function detectFromDict<T extends string>(text: string, dict: Partial<Record<T, string[]>>): T | null {
  for (const key of Object.keys(dict) as T[]) {
    const words = dict[key]
    if (words && words.some((w) => text.includes(w))) return key
  }
  return null
}

function detectIntent(text: string): Intent {
  if (GREETING_KEYWORDS.some((k) => text.includes(k)) && text.length <= 12) return 'greeting'

  let best: Intent = 'unknown'
  let bestScore = 0
  for (const intent of INTENT_PRIORITY) {
    const words = INTENT_KEYWORDS[intent as Exclude<Intent, 'greeting' | 'knowledge' | 'unknown'>]
    if (!words) continue
    const score = words.reduce((sum, w) => sum + (text.includes(w) ? 1 : 0), 0)
    if (score > bestScore) {
      bestScore = score
      best = intent
    }
  }
  return best
}

function topSouvenirs(cats: SouvenirCategory[], limit: number): Souvenir[] {
  return SOUVENIRS
    .filter((s) => cats.includes(s.cat))
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, limit)
}

function souvenirCard(s: Souvenir): AssistantCard {
  return {
    title: s.name,
    subtitle: s.short,
    meta: `${s.jpy} / ${s.cny}`,
    href: '#/shopping',
  }
}

/* ----------------------------- 各意图回答构造 ----------------------------- */

function buildItinerary(regionId: RegionId, daysInput: number | null, companion: Companion | null): AssistantReply {
  const region = REGIONS.find((r) => r.id === regionId)
  if (!region) return buildOverview()
  const days = daysInput ?? 3
  const spots = region.spots
  const perDay = Math.max(2, Math.min(3, Math.ceil(spots.length / days)))
  const bullets: string[] = []
  for (let d = 0; d < days; d += 1) {
    const slice = spots.slice(d * perDay, d * perDay + perDay).map((s) => s.name)
    if (slice.length === 0) {
      bullets.push(`Day ${d + 1}：机动日，可安排购物/温泉/近郊一日游或回顾未逛完的点`)
    } else {
      bullets.push(`Day ${d + 1}：${slice.join(' + ')}`)
    }
  }
  const companionNote: Record<Companion, string> = {
    family: '带孩子建议把节奏放慢，穿插水族馆/乐园/公园，午后留出休息。',
    elder: '带长辈每天景点别超过 3 个，多用观光设施少走山路，晚上安排温泉。',
    couple: '情侣可把夜景、展望台和特色咖啡排在傍晚，氛围更好。',
    friends: '结伴出行可加入购物商圈和夜生活，行程更灵活。',
    solo: '一个人出行以公共交通为主，重点景点提前查开放时间。',
  }
  const text = `为你规划的${region.name} ${days} 天路线（可按体力增减）：${companion ? companionNote[companion] : ''}`
  return {
    text,
    bullets,
    chips: ['换成 5 天行程', `${region.name}有什么美食？`, `${region.name}买什么好？`, '几月去最合适？'],
    sources: ['站内景点数据'],
    cards: spots.slice(0, 3).map((s) => ({ title: s.name, subtitle: s.tag, meta: s.duration, href: '#/' })),
  }
}

function buildSpots(regionId: RegionId): AssistantReply {
  const region = REGIONS.find((r) => r.id === regionId)
  if (!region) return buildOverview()
  const top = region.spots.slice(0, 6)
  return {
    text: `${region.name}最值得打卡的景点（${region.intro.slice(0, 24)}…）：`,
    bullets: top.map((s) => `${s.name}（${s.tag}）：${s.desc.slice(0, 30)}…`),
    chips: [`${region.name}怎么安排 3 天？`, `${region.name}美食推荐`, `${region.name}买什么？`],
    sources: ['站内景点数据'],
    cards: top.slice(0, 3).map((s) => ({ title: s.name, subtitle: s.tag, meta: s.ticket, href: '#/' })),
  }
}

function buildFood(regionId: RegionId): AssistantReply {
  const data = FOOD_BY_REGION[regionId]
  const name = regionName(regionId)
  const bullets = data.items.map((item) => {
    const shop = item.shops?.[0]
    return shop ? `${item.title}：${item.desc}（推荐 ${shop.name}）` : `${item.title}：${item.desc}`
  })
  return {
    text: `${name}必吃的地道美食：`,
    bullets,
    chips: [`${name}景点推荐`, `${name}怎么安排行程？`, `${name}买什么伴手礼？`],
    sources: ['站内美食榜单'],
  }
}

function buildShopping(category: SouvenirCategory | null): AssistantReply {
  const items = category ? topSouvenirs([category], 5) : SOUVENIRS.slice().sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, 5)
  const label = category ?? '综合好物'
  return {
    text: `${label}方向，站内购物指南里评分最高的几件（Top 78 榜单可在“购物指南”页查看）：`,
    bullets: items.map((s) => `${s.name}｜${s.jpy} / ${s.cny}：${s.short}`),
    chips: ['药妆买什么？', '电子产品推荐', '奢侈品/中古怎么逛？', '免税怎么退？'],
    sources: ['站内购物指南'],
    cards: items.slice(0, 3).map(souvenirCard),
  }
}

function buildCategoryShopping(cats: SouvenirCategory[], title: string, chips: string[]): AssistantReply {
  const items = topSouvenirs(cats, 6)
  return {
    text: `${title}（按站内推荐指数排序）：`,
    bullets: items.map((s) => `${s.name}｜${s.jpy} / ${s.cny}：${s.short}`),
    chips,
    sources: ['站内购物指南'],
    cards: items.slice(0, 3).map(souvenirCard),
  }
}

function buildSeason(season: SeasonKey | null): AssistantReply {
  if (!season) {
    return {
      text: '日本四季各有玩法，第一次去建议春秋优先：',
      bullets: [
        '春（3–4 月）：樱花季，东京/京都/大阪赏樱，需提前订房',
        '夏（7–8 月）：祭典花火、冲绳海岛、北海道避暑',
        '秋（10–11 月）：京都红叶最负盛名，早出门避人潮',
        '冬（12–2 月）：北海道雪景与温泉，注意防滑保暖',
      ],
      chips: ['樱花季几月去？', '红叶季去哪好？', '冬天去北海道玩什么？'],
      sources: ['站内四季物语'],
    }
  }
  const detail = SEASON_DETAILS[season]
  return {
    text: `${detail.title}（${detail.months}）：${detail.intro.slice(0, 40)}…`,
    bullets: [
      `天气：${detail.weather}`,
      ...detail.highlights.slice(0, 3),
      `建议携带：${detail.carry.slice(0, 3).join('、')}`,
    ],
    chips: ['这个季节去哪个城市好？', '这季节穿什么？', '帮我规划行程'],
    sources: ['站内四季物语'],
  }
}

function buildEvent(regionId: RegionId | null): AssistantReply {
  if (regionId && LOCAL_EVENTS[regionId]?.length) {
    const events = LOCAL_EVENTS[regionId]
    return {
      text: `${regionName(regionId)}值得赶上的当地活动：`,
      bullets: events.slice(0, 4).map((e) => `${e.title}（${e.date}）@${e.place}：${e.desc.slice(0, 26)}…`),
      chips: [`${regionName(regionId)}景点推荐`, '几月去最合适？'],
      sources: ['站内当地活动'],
    }
  }
  const all = Object.values(LOCAL_EVENTS).flat().slice(0, 5)
  return {
    text: '日本各地全年都有特色祭典与活动，代表性的有：',
    bullets: all.map((e) => `${e.title}（${e.date}）@${e.place}`),
    chips: ['东京有什么活动？', '大阪有什么活动？', '几月去最合适？'],
    sources: ['站内当地活动'],
  }
}

function buildDistrict(regionId: RegionId | null): AssistantReply {
  const cityName = regionId ? regionName(regionId) : null
  const list = cityName ? SHOPPING_DISTRICTS.filter((d) => d.city.includes(cityName)) : SHOPPING_DISTRICTS
  const picked = (list.length ? list : SHOPPING_DISTRICTS).slice(0, 5)
  return {
    text: `${cityName ?? '日本'}值得逛的购物商圈（详细营业时间与地图见“购物指南”页）：`,
    bullets: picked.map((d) => `${d.name}（${d.city}）｜${d.hours}｜${d.address}`),
    chips: ['必买清单有哪些？', '药妆买什么？', '免税怎么退？'],
    sources: ['站内购物商圈'],
  }
}

function buildFromKnowledge(entry: KnowledgeEntry, chips: string[]): AssistantReply {
  return { text: entry.answer, bullets: entry.bullets, chips, sources: ['站内知识库'] }
}

function knowledgeById(id: string): KnowledgeEntry | undefined {
  return TRAVEL_KNOWLEDGE_BASE.find((e) => e.id === id)
}

function buildOverview(): AssistantReply {
  return {
    text: '我可以基于站内真实数据帮你规划日本行程，也能给购物、美食、季节、交通建议。告诉我城市/天数/同行人，会更精准，比如“带爸妈去京都大阪玩 5 天”。',
    bullets: [
      '行程规划：东京、京都、大阪、富士箱根、奈良、北海道、冲绳',
      '购物清单：药妆、彩妆、电子、奢侈中古、运动潮流（Top 78 榜单）',
      '美食推荐：各地地道店铺榜单',
      '实用信息：季节、交通、预算、活动、礼仪与紧急联络',
    ],
    chips: ['第一次去东京怎么安排？', '带爸妈去关西玩什么？', '药妆必买清单', '樱花季几月去？'],
    sources: ['站内综合数据'],
  }
}

function buildGreeting(): AssistantReply {
  const reply = buildOverview()
  reply.text = '你好，我是日本旅游 AI 小助手 👋 我基于站内真实景点、美食、购物、季节和活动数据来回答，尽量给你具体、可执行的建议。'
  return reply
}

/* 改进版知识库匹配：标签命中 + 分词命中，作为兜底 */
function scoreEntry(entry: KnowledgeEntry, query: string): number {
  const normalized = query.toLowerCase()
  const pool = [entry.title, entry.answer, ...entry.tags, ...entry.bullets].join(' ').toLowerCase()
  const tagScore = entry.tags.reduce((score, tag) => score + (normalized.includes(tag.toLowerCase()) ? 4 : 0), 0)
  const tokenScore = normalized
    .split(/\s+|，|。|、|？|\?|！|!|,|\./)
    .filter((word) => word.length > 1 && pool.includes(word)).length
  return tagScore + tokenScore
}

function buildKnowledgeFallback(query: string): AssistantReply {
  const ranked = TRAVEL_KNOWLEDGE_BASE
    .map((entry) => ({ entry, score: scoreEntry(entry, query) }))
    .sort((a, b) => b.score - a.score)
  const best = ranked[0]
  if (best && best.score > 0) {
    return {
      text: best.entry.answer,
      bullets: best.entry.bullets,
      chips: ranked.slice(1, 4).map((r) => r.entry.title),
      sources: ['站内知识库'],
    }
  }
  const overview = buildOverview()
  overview.text = '这个问题我还没完全 get 到～可以补充城市、天数、同行人或想了解的方向（行程/美食/购物/季节/交通），我就能给更具体的建议。'
  return overview
}

/* ----------------------------- 主入口 ----------------------------- */

export function respond(rawQuery: string, ctx: AssistantContext): { reply: AssistantReply; context: AssistantContext } {
  const query = rawQuery.trim()
  const text = query.toLowerCase()

  // 槽位抽取（命中则更新，未命中沿用上下文）
  const region = detectRegion(query) ?? ctx.slots.region
  const days = detectDays(query) ?? ctx.slots.days
  const budget = detectFromDict<BudgetLevel>(query, BUDGET_KEYWORDS) ?? ctx.slots.budget
  const companion = detectFromDict<Companion>(query, COMPANION_KEYWORDS) ?? ctx.slots.companion
  const season = detectFromDict<SeasonKey>(query, SEASON_KEYWORDS) ?? ctx.slots.season
  const category = detectFromDict<SouvenirCategory>(query, CATEGORY_KEYWORDS) ?? ctx.slots.category

  let intent = detectIntent(text)
  // 多轮延续：只说了地点/季节等而没表达新意图时，沿用上一次意图
  if (intent === 'unknown' && ctx.lastIntent && ctx.lastIntent !== 'greeting') {
    intent = ctx.lastIntent
  }

  const slots: AssistantSlots = { region, days, budget, companion, season, category }
  const nextCtx: AssistantContext = { slots, lastIntent: intent === 'unknown' ? ctx.lastIntent : intent }

  let reply: AssistantReply
  switch (intent) {
    case 'greeting':
      reply = buildGreeting()
      break
    case 'itinerary':
      reply = region ? buildItinerary(region, days, companion) : askForRegion('帮你规划行程')
      break
    case 'spot':
      reply = region ? buildSpots(region) : askForRegion('推荐景点')
      break
    case 'food':
      reply = region ? buildFood(region) : askForRegion('推荐美食')
      break
    case 'drugstore':
      reply = buildCategoryShopping(
        ['彩妆美妆', '护肤精华', '面膜清洁', '防晒隔离', '日用护理', '保健药品', '药品常备'],
        '药妆店必买（护肤 / 彩妆 / 防晒 / 常备药）',
        ['电子产品推荐', '免税怎么退？', '奢侈品怎么逛？'],
      )
      break
    case 'electronics':
      reply = buildCategoryShopping(
        ['电子产品', '个护电器', '厨房家电'],
        '电子产品 & 电器必买',
        ['去哪家电器店？', '药妆买什么？', '免税怎么退？'],
      )
      break
    case 'luxury':
      reply = buildCategoryShopping(
        ['奢侈品', '时尚饰品'],
        '奢侈品 & 中古好物',
        ['中古店怎么避坑？', '去哪买奢侈品？', '免税怎么退？'],
      )
      break
    case 'shopping':
      reply = buildShopping(category)
      break
    case 'season':
      reply = buildSeason(season)
      break
    case 'transport': {
      const entry = knowledgeById('transport-guide')
      reply = entry ? buildFromKnowledge(entry, ['预算大概多少？', '帮我规划行程', '几月去最合适？']) : buildOverview()
      break
    }
    case 'budget': {
      const entry = knowledgeById('budget-guide')
      reply = entry ? buildFromKnowledge(entry, ['怎么省钱？', '交通怎么搭？', '帮我规划行程']) : buildOverview()
      break
    }
    case 'event':
      reply = buildEvent(region)
      break
    case 'district':
      reply = buildDistrict(region)
      break
    default:
      reply = buildKnowledgeFallback(query)
      break
  }

  return { reply, context: nextCtx }
}

/* 为后端 LLM 构建“聚焦的站内资料”上下文：复用检测逻辑做轻量检索，避免每次发送全站数据。 */
export function buildKnowledgeContext(rawQuery: string, ctx: AssistantContext): string {
  const text = rawQuery.toLowerCase()
  const region = detectRegion(rawQuery) ?? ctx.slots.region
  const category = detectFromDict<SouvenirCategory>(rawQuery, CATEGORY_KEYWORDS) ?? ctx.slots.category
  const intent = detectIntent(text)
  const sections: string[] = []

  sections.push('【网站结构】首页含：七大目的地景点、各地美食榜单、旅行影像、四季物语、当地活动、旅行工具箱(JR Pass盈亏试算/汇率退税/VJW清单/天气穿衣/日语求助卡)；另有「我的收藏」页与「购物指南」页（必买 Top 78 榜单、27 个分类、真实商品图与价格、购物商圈地图）。')

  const budgetLabel: Record<BudgetLevel, string> = { low: '经济省钱', mid: '舒适适中', high: '品质高端' }
  const companionLabel: Record<Companion, string> = { family: '亲子(带小孩)', elder: '带长辈', couple: '情侣', friends: '结伴出游', solo: '独自旅行' }
  const seasonLabel: Record<SeasonKey, string> = { spring: '春季/樱花季', summer: '夏季', autumn: '秋季/红叶季', winter: '冬季/雪季' }
  const profile: string[] = []
  if (ctx.slots.region) profile.push(`目的地=${regionName(ctx.slots.region)}`)
  if (ctx.slots.days) profile.push(`天数=${ctx.slots.days}天`)
  if (ctx.slots.budget) profile.push(`预算=${budgetLabel[ctx.slots.budget]}`)
  if (ctx.slots.companion) profile.push(`同行人=${companionLabel[ctx.slots.companion]}`)
  if (ctx.slots.season) profile.push(`季节=${seasonLabel[ctx.slots.season]}`)
  if (ctx.slots.category) profile.push(`关注品类=${ctx.slots.category}`)
  if (profile.length) sections.push(`【用户画像 · 多轮累积，请延续这些偏好，不要让用户重复】${profile.join('，')}`)

  if (region) {
    const r = REGIONS.find((x) => x.id === region)
    if (r) {
      sections.push(`【${r.name}·景点】` + r.spots.map((s) => {
        const d = SPOT_DETAILS[s.name]
        let extra = ''
        if (d) {
          extra += `；地址:${d.addr}`
          if (d.food?.length) extra += `；周边美食:${d.food.slice(0, 3).join('、')}`
          if (d.checkin?.length) extra += `；打卡:${d.checkin.slice(0, 2).join('、')}`
          if (d.hotels?.length) extra += `；住宿:${d.hotels.slice(0, 2).join('、')}`
        }
        return `${s.name}(${s.tag}；门票:${s.ticket ?? '—'}；开放:${s.hours ?? '—'}${extra})`
      }).join('；'))
      const food = FOOD_BY_REGION[r.id]
      sections.push(`【${r.name}·美食】` + food.items.map((i) => `${i.title}(${i.desc})推荐:${(i.shops ?? []).slice(0, 2).map((sh) => sh.name).join('、')}`).join('；'))
      const events = LOCAL_EVENTS[r.id]
      if (events?.length) sections.push(`【${r.name}·活动】` + events.slice(0, 4).map((e) => `${e.title}(${e.date}@${e.place})`).join('；'))
      const districts = SHOPPING_DISTRICTS.filter((d) => d.city.includes(r.name))
      if (districts.length) sections.push(`【${r.name}·购物商圈】` + districts.map((d) => `${d.name}(${d.hours}；${d.address})`).join('；'))
    }
  } else {
    sections.push('【七大目的地】' + REGIONS.map((r) => `${r.name}:${r.spots.slice(0, 4).map((s) => s.name).join('、')}`).join('；'))
  }

  sections.push('【购物趋势·日本价差重点】用户如果问“日本便宜国内贵/小红书热门/奢侈品包包”，优先推荐：LV Neverfull/Speedy、Chanel 中古 CF/19/22、Goyard St. Louis/Anjou、Celine Triomphe、Loewe Puzzle/Flamenco、Mikimoto/TASAKI 珍珠、BAO BAO、PORTER、Onitsuka Tiger、Lululemon Outlet。务必提醒奢侈品差价会受实时公价、汇率、退税、库存影响，不能编造精确折扣。')

  const shoppingIntents: Intent[] = ['shopping', 'drugstore', 'electronics', 'luxury']
  const sortedByRating = SOUVENIRS.slice().sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
  let sv: Souvenir[]
  if (category) sv = topSouvenirs([category], 10)
  else if (shoppingIntents.includes(intent)) sv = sortedByRating.slice(0, 12)
  else sv = sortedByRating.slice(0, 6)
  sections.push('【购物指南·热门商品(价格为站内真实数据)】' + sv.map((s) => `${s.name}[${s.cat}] ${s.jpy}/${s.cny}:${s.short}`).join('；'))

  sections.push('【四季物语】' + Object.values(SEASON_DETAILS).map((d) => `${d.title}(${d.months}):${d.intro.slice(0, 30)};携带:${d.carry.slice(0, 3).join('、')}`).join('；'))

  const practicalIds = ['transport-guide', 'budget-guide', 'shopping-taxfree', 'etiquette-emergency']
  practicalIds.forEach((id) => {
    const entry = knowledgeById(id)
    if (entry) sections.push(`【${entry.title}】${entry.answer}`)
  })

  return sections.join('\n')
}

function askForRegion(action: string): AssistantReply {
  return {
    text: `想让我${action}，先告诉我去哪个城市？点下面的选项或直接输入城市名即可。`,
    bullets: ['支持：东京、京都、大阪、富士箱根、奈良、北海道、冲绳'],
    chips: ['东京', '京都', '大阪', '北海道', '冲绳'],
    sources: ['需要更多信息'],
  }
}
