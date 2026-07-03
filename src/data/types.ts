/* 全站数据类型定义 */

export type RegionId = 'tokyo' | 'kyoto' | 'osaka' | 'fuji' | 'nara' | 'hokkaido' | 'okinawa'

export type SeasonKey = 'spring' | 'summer' | 'autumn' | 'winter'

export type FavType = 'spots' | 'foods' | 'souvenirs' | 'events'

/* --------------- Hero --------------- */
export interface HeroSlide {
  eyebrow: string
  /** 允许 HTML <br> */
  title: string
  tag: string
  sub: string
}

/* --------------- Region / Spot --------------- */
export interface Spot {
  name: string
  jp?: string
  img: string
  tag: string
  desc: string
  hours?: string
  ticket?: string
  duration?: string
  transport?: string
  tip?: string
}

export interface Region {
  id: RegionId
  name: string
  en: string
  jp?: string
  intro: string
  spots: Spot[]
}

/* --------------- Spot Detail --------------- */
export interface SpotReview {
  u: string
  r: number
  t: string
}

export interface SpotDetail {
  addr: string
  tel?: string
  lat: number
  lng: number
  rating: number | string
  food?: string[]
  checkin?: string[]
  hotels?: string[]
  reviews?: SpotReview[]
  notes?: string[]
}

/* --------------- Food --------------- */
export interface Restaurant {
  name: string
  addr: string
  tel?: string
  rating?: number | string
  review?: string
}

export interface FoodItem {
  title: string
  desc: string
  shops?: Restaurant[]
}

export interface RegionFoodData {
  img: string
  items: FoodItem[]
}

/* --------------- Video --------------- */
export interface VideoItem {
  bv: string
  title: string
}

/* --------------- Souvenir / Shopping --------------- */
export interface SouvenirBuyPlace {
  /** 门店 / 品牌名 */
  n: string
  /** 地址 / 备注（老字段） */
  a: string
  /** 结账/免税/优惠等备注（新字段，可选） */
  note?: string
}

export type SouvenirRating = 1 | 2 | 3 | 4 | 5

/** 购物页分类（20 类） */
export type SouvenirCategory =
  | '护肤精华'
  | '面膜清洁'
  | '防晒隔离'
  | '日用护理'
  | '保健药品'
  | '饼干巧克力'
  | '糖果软糖'
  | '泡面速食'
  | '酒水茶饮'
  | '厨房家电'
  | '个护电器'
  | '穿搭服饰'
  | '鞋履箱包'
  | '文具手账'
  | '家居香氛'
  | '餐具工艺'
  | '动漫手办'
  | 'IP 周边'
  | '母婴用品'
  | '伴手礼限定'
  | '运动休闲'
  | '服装穿搭'
  | '电子产品'
  | '奢侈品'
  | '药品常备'
  | '时尚饰品'
  | '彩妆美妆'

export interface ShoppingCategoryMeta {
  icon: string
  blurb: string
}

export interface ShoppingDistrict {
  id: string
  name: string
  en?: string
  city: string
  address: string
  hours: string
  tags: string[]
  desc: string
  nearby?: string[]
  mapQuery?: string
}

export interface Souvenir {
  id: string
  cat: SouvenirCategory
  name: string
  en?: string
  jp?: string
  img: string
  imgExt?: 'jpg' | 'jpeg' | 'png' | 'svg' | 'webp'
  tag: string
  short: string
  jpy: string
  cny: string
  jpy2?: string
  why: string
  buy: SouvenirBuyPlace[]
  /** 推荐指数（1-5） */
  rating?: SouvenirRating
  /** 适合人群 / 送礼场景 */
  audience?: string[]
  /** 3-5 条商品亮点，可与 why 互补 */
  highlights?: string[]
}

/* --------------- Season --------------- */
export interface SeasonGuideCard {
  icon: string
  title: string
  text: string
}

export interface SeasonDetail {
  key: SeasonKey
  title: string
  en: string
  months: string
  rating: number
  hero: string
  intro: string
  weather: string
  carry: string[]
  highlights: string[]
  guide: SeasonGuideCard[]
  videoBV: string
  gallery: string[]
}

/* --------------- Local Event --------------- */
export interface LocalEvent {
  title: string
  jp?: string
  date: string
  season?: string
  place: string
  img: string
  tag: string
  desc: string
  tips: string[]
  nearby?: string[]
}

/* --------------- Intro cards --------------- */
export type IntroType = 'regions' | 'categories' | 'prices' | 'videos'

export interface IntroCard {
  title: string
  type: IntroType
}

export interface IntroSightCategory {
  name: string
  icon: string
  desc: string
  items: string[]
}

export interface IntroTicketRow {
  name: string
  region: string
  jpy: string
  cny: string
}

/* --------------- Favorites --------------- */
export interface FavoritesState {
  spots: string[]
  foods: string[]
  souvenirs: string[]
  events: string[]
}

export interface FavoriteCounts {
  spots: number
  foods: number
  souvenirs: number
  events: number
}
