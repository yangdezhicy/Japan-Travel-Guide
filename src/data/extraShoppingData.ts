import type { ShoppingCategoryMeta, Souvenir, SouvenirCategory } from './types'

export const EXTRA_SHOPPING_CATEGORY_ORDER: SouvenirCategory[] = [
  '运动休闲',
  '服装穿搭',
  '电子产品',
  '奢侈品',
  '药品常备',
  '时尚饰品',
  '彩妆美妆',
]

export const EXTRA_SHOPPING_CATEGORY_META: Partial<Record<SouvenirCategory, ShoppingCategoryMeta>> = {
  运动休闲: {
    icon: 'directions_run',
    blurb: '球鞋、机能外套、运动包和日本限定配色集中在这里，适合涩谷、原宿、ABC-MART、atmos 一路扫。',
  },
  服装穿搭: {
    icon: 'styler',
    blurb: '基础款、设计师联名、日系工装与通勤单品并列，建议按尺码先试穿再决定是否退税。',
  },
  电子产品: {
    icon: 'devices',
    blurb: '相机、耳机、美容仪、小家电和配件差价明显，重点看电压、保修语言与是否支持国际版。',
  },
  奢侈品: {
    icon: 'diamond',
    blurb: '百货新品、奥莱折扣和中古精品三条线都值得看，包袋、腕表、珠宝要重点核对成色和附件。',
  },
  药品常备: {
    icon: 'medical_services',
    blurb: '胃肠、感冒、眼药水、贴布、喉咙护理最常回购，购买前请确认说明书、禁忌和个人过敏史。',
  },
  时尚饰品: {
    icon: 'watch',
    blurb: '腕表、眼镜、香氛、围巾、帽子和小皮具很适合做旅行战利品，轻便又有记忆点。',
  },
  彩妆美妆: {
    icon: 'palette',
    blurb: '开架彩妆、日系底妆、腮红、眉粉和限定色最适合现场试色，Loft、PLAZA、@cosme 都好逛。',
  },
}

const sharedBuy = {
  sports: [
    { n: 'atmos / ABC-MART GRAND STAGE', a: '涩谷 / 原宿 / 新宿', note: '球鞋限定色和运动休闲款集中，热门尺码建议早逛' },
    { n: '品牌旗舰店', a: '涩谷 Scramble Square / 原宿 / 银座', note: '适合试穿和找日本限定配色' },
  ],
  fashion: [
    { n: '涩谷 109 / LUMINE / PARCO', a: '东京涩谷、新宿一带', note: '年轻穿搭、联名款、日系品牌密度高' },
    { n: '表参道 / 代官山选货店', a: '东京时尚街区', note: '更适合找设计感和小众品牌' },
  ],
  electronics: [
    { n: 'Bic Camera / Yodobashi Camera', a: '新宿 / 秋叶原 / 难波 / 梅田', note: '注意电压、保修、语言菜单与免税柜台' },
    { n: 'Map Camera / 大林相机', a: '新宿 / 大阪梅田', note: '相机镜头适合对比中古成色与保修' },
  ],
  luxury: [
    { n: '银座 / 表参道百货', a: '东京核心奢侈品商圈', note: '新品、限定色和退税服务更完整' },
    { n: 'Komehyo / ALLU / Ragtag', a: '东京银座、涩谷 / 大阪心斋桥', note: '中古包表珠宝要看成色、附件与保卡' },
  ],
  drug: [
    { n: '松本清 / SUNDRUG / 大国药妆', a: '新宿 / 涩谷 / 心斋桥 / 京都四条', note: '同店凑单、优惠券和免税一起看' },
    { n: '机场药妆 / Don Quijote', a: '羽田 / 成田 / 关西机场及市区', note: '适合最后补货常备药和小件护理' },
  ],
  accessory: [
    { n: '百货饰品层 / Loft / PLAZA', a: '东京、大阪、京都核心商圈', note: '轻便小物、香氛、腕表配件更好买' },
    { n: '中目黑 / 代官山选货店', a: '东京小众买手店区域', note: '适合找不撞款饰品和小皮具' },
  ],
  makeup: [
    { n: '@cosme TOKYO / Loft / PLAZA', a: '原宿、涩谷、新宿', note: '适合现场试色和看榜单陈列' },
    { n: '药妆店彩妆区', a: '松本清 / SUNDRUG / Donki', note: '开架底妆、眉粉、唇膏可凑单' },
  ],
}

export const EXTRA_SOUVENIRS: Souvenir[] = [
  { id: 'luxury_lv_neverfull_japan', cat: '奢侈品', name: 'Louis Vuitton Neverfull / Speedy 经典包', en: 'Louis Vuitton Icon Bags', jp: 'ルイ・ヴィトン 定番バッグ', tag: '日本价差款', short: '日本专柜 + 退税后常被拿来和国内专柜比价', jpy: '¥245,000–310,000', cny: '约合 ¥10,241–12,958', rating: 5, audience: ['自用', '保值包袋'], img: 'product_coach_japan', imgExt: 'png', buy: sharedBuy.luxury, why: '经典老花包在日本专柜货源和退税体验更稳定，日元低位时常被攻略列为“日本便宜国内贵”的优先比价项；实际差价需以门店实时价和汇率为准。', highlights: ['先查国内专柜价再现场比价', '热门款可能限购或断货', '保留小票、包装和退税凭证'] },
  { id: 'luxury_chanel_vintage_cf', cat: '奢侈品', name: '中古 Chanel CF / 19 / 22 包', en: 'Vintage Chanel Bags', jp: '中古シャネル バッグ', tag: '中古热门', short: '日本中古体系成熟，适合淘经典款', jpy: '¥380,000 起', cny: '约合 ¥15,884 起', rating: 5, audience: ['收藏', '预算充足'], img: 'product_coach_japan', imgExt: 'png', buy: sharedBuy.luxury, why: '东京表参道、银座和大阪心斋桥中古店密集，Chanel 经典款成色分级相对透明，适合和国内二级市场价格对比。', highlights: ['重点看成色等级、镀金磨损和附件', '优先选 Komehyo / Brand Off / Amore 等连锁或专门店', '不要只看低价，鉴定和售后更重要'] },
  { id: 'luxury_goyard_stlouis', cat: '奢侈品', name: 'Goyard St. Louis / Anjou 托特包', en: 'Goyard St. Louis / Anjou', jp: 'ゴヤール トート', tag: '国内稀缺款', short: '国内货源少，日本现货和配色更值得看', jpy: '¥210,000–420,000', cny: '约合 ¥8,778–17,556', rating: 5, audience: ['通勤', '轻奢包袋'], img: 'product_coach_japan', imgExt: 'png', buy: sharedBuy.luxury, why: 'Goyard 国内购买渠道少且溢价明显，日本专柜如果遇到现货很适合重点比价；具体颜色和尺寸库存需到店确认。', highlights: ['银座/日本桥百货可重点看', '热门颜色断货快', '轻便大容量适合通勤旅行'] },
  { id: 'luxury_celine_triomphe', cat: '奢侈品', name: 'Celine Triomphe 凯旋门包', en: 'Celine Triomphe Bag', jp: 'セリーヌ トリオンフ', tag: '小红书高热', short: '通勤和法式穿搭热度高，适合专柜试背', jpy: '¥420,000–620,000', cny: '约合 ¥17,556–25,916', rating: 5, audience: ['通勤', '送礼'], img: 'product_coach_japan', imgExt: 'png', buy: sharedBuy.luxury, why: 'Celine 凯旋门系列是近年攻略高频款，日本百货退税和游客优惠叠加时值得比价，但要以实时公价为准。', highlights: ['先试尺寸和肩带长度', '黑色/棕色最保守', '关注百货游客折扣规则'] },
  { id: 'luxury_loewe_puzzle', cat: '奢侈品', name: 'Loewe Puzzle / Flamenco 包', en: 'Loewe Puzzle / Flamenco', jp: 'ロエベ バッグ', tag: '设计感包袋', short: '设计感强，比国内专柜更适合现场比价', jpy: '¥310,000–520,000', cny: '约合 ¥12,958–21,736', rating: 4, audience: ['自用', '设计感穿搭'], img: 'product_coach_japan', imgExt: 'png', buy: sharedBuy.luxury, why: 'Loewe 热门包款在日本专柜和百货较容易完整试背，日元低位时常被列为高预算购物清单。', highlights: ['Puzzle 看皮质和尺寸', 'Flamenco 更轻便柔软', '实际差价需现场核算'] },
  { id: 'luxury_mikimoto_tasaki', cat: '奢侈品', name: 'Mikimoto / TASAKI 珍珠首饰', en: 'Mikimoto / TASAKI Pearl Jewelry', jp: 'ミキモト / タサキ', tag: '日本本土珠宝', short: '本土品牌，银座本店体验好', jpy: '¥55,000–350,000', cny: '约合 ¥2,299–14,630', rating: 5, audience: ['送妈妈', '纪念礼物'], img: 'top_shiro_perfume', imgExt: 'png', buy: sharedBuy.luxury, why: '珍珠首饰是日本本土强项，Mikimoto 和 TASAKI 的款式、服务和纪念属性都强，适合作为高预算礼物。', highlights: ['看珍珠光泽和证书', '银座本店适合慢慢选', '小耳钉比大件更容易入门'] },
  { id: 'sports_onitsuka_mexico66', cat: '运动休闲', name: 'Onitsuka Tiger Mexico 66', en: 'Onitsuka Tiger Mexico 66', jp: 'オニツカタイガー メキシコ66', tag: '日本本土潮鞋', short: '日本本土品牌，经典黄黑配色热度高', jpy: '¥13,200–17,600', cny: '约合 ¥552–736', rating: 5, audience: ['情侣鞋', '潮流穿搭'], img: 'top_onitsuka_tiger', imgExt: 'png', buy: sharedBuy.sports, why: '鬼塚虎在日本门店配色和尺码更完整，Mexico 66 是小红书穿搭里最容易被点名的日系鞋款之一。', highlights: ['黄黑/银色最热门', '鞋型偏窄建议试穿', '适合涩谷、原宿路线'] },
  { id: 'sports_lululemon_outlet', cat: '运动休闲', name: 'Lululemon Outlet 瑜伽服/外套', en: 'Lululemon Outlet Finds', jp: 'ルルレモン アウトレット', tag: '奥莱捡漏', short: '御殿场等奥莱偶有断码好价', jpy: '¥5,000–18,000', cny: '约合 ¥209–752', rating: 4, audience: ['运动', '通勤休闲'], img: 'top_onitsuka_tiger', imgExt: 'png', buy: sharedBuy.sports, why: 'Lululemon 全球定价趋同，但日本 Outlet 遇到断码折扣时很适合捡漏，适合顺路去御殿场的人。', highlights: ['尺码随机性强', '基础黑白灰最实穿', '以门店实时折扣为准'] },

  { id: 'sports_nb_327', cat: '运动休闲', name: 'New Balance 327 日本限定配色', en: 'New Balance 327 JP Color', jp: 'ニューバランス 327', tag: '运动鞋', short: '日常穿搭和旅行暴走都舒服', jpy: '¥13,000–16,000', cny: '约合 ¥544–669', rating: 5, audience: ['自用', '情侣鞋'], img: 'top_onitsuka_tiger', imgExt: 'png', buy: sharedBuy.sports, why: '日本门店常能遇到更完整尺码和限定配色，适合想买舒适通勤鞋的人。', highlights: ['适合日行两万步旅行', '浅色系很好搭日系穿搭', '建议现场试码，部分鞋楦偏窄'] },
  { id: 'sports_salomon_xt6', cat: '运动休闲', name: 'Salomon XT-6 越野机能鞋', en: 'Salomon XT-6', jp: 'サロモン XT-6', tag: '机能鞋', short: '小红书机能风和城市户外高频出现', jpy: '¥28,000–31,000', cny: '约合 ¥1,170–1,296', rating: 5, audience: ['自用', '潮流穿搭'], img: 'top_onitsuka_tiger', imgExt: 'png', buy: sharedBuy.sports, why: '适合城市户外风，东京潮流球鞋店更容易看见配色。', highlights: ['机能风穿搭核心单品', '适合涩谷、原宿试穿', '热门色断码快'] },
  { id: 'sports_hoka_bondi', cat: '运动休闲', name: 'HOKA Bondi 厚底跑鞋', en: 'HOKA Bondi', jp: 'ホカ ボンダイ', tag: '跑步休闲', short: '厚底缓震强，适合长时间走路', jpy: '¥23,000–26,000', cny: '约合 ¥961–1,087', rating: 4, audience: ['自用', '长辈'], img: 'top_onitsuka_tiger', imgExt: 'png', buy: sharedBuy.sports, why: '日本旅行步行量大，厚底缓震鞋是实用型购买。', highlights: ['适合暴走行程', '建议试穿确认脚背高度', '黑白灰最百搭'] },
  { id: 'sports_asics_gel', cat: '运动休闲', name: 'ASICS GEL 系列复古跑鞋', en: 'ASICS GEL Series', jp: 'アシックス GEL', tag: '日系跑鞋', short: '日本本土品牌，复古跑鞋很适合搭阔腿裤', jpy: '¥13,000–20,000', cny: '约合 ¥544–836', rating: 5, audience: ['自用', '送男友'], img: 'top_onitsuka_tiger', imgExt: 'png', buy: sharedBuy.sports, why: '日系运动休闲代表，门店配色和尺码选择更直观。', highlights: ['复古跑鞋热度高', '适合通勤和旅行', '银灰色系最容易搭'] },

  { id: 'fashion_uniqlo_heattech_plus', cat: '服装穿搭', name: 'UNIQLO HEATTECH 保暖内搭', en: 'UNIQLO HEATTECH', jp: 'ヒートテック', tag: '基础款', short: '冬季日本旅行和回国通勤都能穿', jpy: '¥1,290–2,990', cny: '约合 ¥54–125', rating: 5, audience: ['自用', '全家'], img: 'product_uniqlo_heattech', imgExt: 'png', buy: sharedBuy.fashion, why: '基础款不挑人，轻便好带，适合冬天或早春晚秋补货。', highlights: ['薄款到极暖可选', '尺码齐全', '适合凑单自用'] },
  { id: 'fashion_beams_jacket', cat: '服装穿搭', name: 'BEAMS Japan 城市外套', en: 'BEAMS Japan Jacket', jp: 'ビームス ジャパン', tag: '日系选货', short: '适合想买一点日系设计感的人', jpy: '¥18,000–35,000', cny: '约合 ¥752–1,463', rating: 4, audience: ['自用', '送男友'], img: 'product_beams_japan', imgExt: 'png', buy: sharedBuy.fashion, why: '日本选货店代表，基础但有细节，适合逛新宿、涩谷时慢慢试。', highlights: ['剪裁更日系', '适合秋冬叠穿', '门店陈列很好逛'] },
  { id: 'fashion_human_made_cap', cat: '服装穿搭', name: 'Human Made 心形帽衫/帽子', en: 'Human Made', jp: 'ヒューマンメイド', tag: '潮牌', short: '街头潮流和日系复古结合', jpy: '¥8,000–35,000', cny: '约合 ¥334–1,463', rating: 4, audience: ['自用', '潮流玩家'], img: 'product_beams_japan', imgExt: 'png', buy: sharedBuy.fashion, why: '适合想买日本潮牌的人，热门款建议提前查门店发售。', highlights: ['辨识度高', '适合涩谷原宿路线', '热门尺码断货快'] },
  { id: 'fashion_muji_wool', cat: '服装穿搭', name: 'MUJI 羊毛围巾/针织衫', en: 'MUJI Wool Wear', jp: '無印良品 ウール', tag: '通勤基础', short: '质感干净，适合不想买太夸张的人', jpy: '¥2,990–7,990', cny: '约合 ¥125–334', rating: 4, audience: ['自用', '送家人'], img: 'product_muji_wool_scarf', imgExt: 'png', buy: sharedBuy.fashion, why: 'MUJI 银座等大型店款式完整，基础服饰不容易踩雷。', highlights: ['低调百搭', '适合送家人', '轻便好打包'] },

  { id: 'electronics_sony_headphones', cat: '电子产品', name: 'Sony WH-1000XM 系列耳机', en: 'Sony WH-1000XM', jp: 'ソニー ヘッドホン', tag: '降噪耳机', short: '通勤、长途飞机和旅行都实用', jpy: '¥45,000–60,000', cny: '约合 ¥1,881–2,508', rating: 5, audience: ['自用', '送伴侣'], img: 'product_dyson_hd08', imgExt: 'png', buy: sharedBuy.electronics, why: '日本电器店试听方便，适合对比耳机佩戴和降噪。', highlights: ['适合长途飞行', '买前确认保修地区', '电器店可叠免税优惠'] },
  { id: 'electronics_fuji_camera', cat: '电子产品', name: 'Fujifilm X 系列相机', en: 'Fujifilm X Series', jp: '富士フイルム X', tag: '相机', short: '旅行拍照党很容易心动的复古相机', jpy: '¥150,000 起', cny: '约合 ¥6,270 起', rating: 5, audience: ['摄影爱好者'], img: 'product_dyson_hd08', imgExt: 'png', buy: sharedBuy.electronics, why: '日本相机店和中古相机店选择多，适合现场试握感和镜头。', highlights: ['复古外观适合旅行记录', '建议确认菜单语言', '中古机要检查快门和保修'] },
  { id: 'electronics_refa_iron', cat: '电子产品', name: 'ReFa 直发夹/卷发棒', en: 'ReFa Hair Iron', jp: 'リファ ヘアアイロン', tag: '美容电器', short: '女生自用和送礼都很稳', jpy: '¥22,000–25,000', cny: '约合 ¥920–1,045', rating: 5, audience: ['自用', '送闺蜜'], img: 'product_refa_straight_iron', imgExt: 'png', buy: sharedBuy.electronics, why: '美容电器是日本购物攻略高频品类，适合百货和电器店比价。', highlights: ['造型工具轻便', '注意电压和插头', '热门色适合送礼'] },
  { id: 'electronics_yaman_device', cat: '电子产品', name: 'YA-MAN 美容仪', en: 'YA-MAN Beauty Device', jp: 'ヤーマン 美顔器', tag: '美容仪', short: '想买进阶护肤仪器可以看这一类', jpy: '¥35,000–80,000', cny: '约合 ¥1,463–3,344', rating: 4, audience: ['自用', '送妈妈'], img: 'product_yaman_beauty', imgExt: 'png', buy: sharedBuy.electronics, why: '日本本土美容仪选择多，适合现场咨询型号差异。', highlights: ['百货和电器店都有', '注意是否国际电压', '保修政策要问清'] },

  { id: 'luxury_bao_bao', cat: '奢侈品', name: 'ISSEY MIYAKE BAO BAO 包', en: 'BAO BAO ISSEY MIYAKE', jp: 'バオバオ', tag: '设计师包', short: '日本买款式和颜色更全', jpy: '¥45,000–90,000', cny: '约合 ¥1,881–3,762', rating: 5, audience: ['自用', '送礼'], img: 'product_coach_japan', imgExt: 'png', buy: sharedBuy.luxury, why: '轻便、有辨识度，日本门店更适合看颜色和尺寸。', highlights: ['银座/表参道可重点看', '热门色可能排队', '适合送女生'] },
  { id: 'luxury_porter_tanker_plus', cat: '奢侈品', name: 'PORTER Tanker 包袋', en: 'PORTER Tanker', jp: 'ポーター タンカー', tag: '日系包袋', short: '轻便耐用，男生女生都适合', jpy: '¥18,000–45,000', cny: '约合 ¥752–1,881', rating: 5, audience: ['自用', '送男友'], img: 'top_porter_tanker', imgExt: 'png', buy: sharedBuy.luxury, why: '日本本土包袋代表，款式完整度和限定色更有优势。', highlights: ['耐用轻便', '黑色最百搭', '适合通勤和旅行'] },
  { id: 'luxury_vintage_chanel', cat: '奢侈品', name: '中古 Chanel / LV 包袋', en: 'Vintage Chanel / LV', jp: 'ヴィンテージバッグ', tag: '中古精品', short: '预算足够时最值得慢慢淘', jpy: '¥120,000 起', cny: '约合 ¥5,016 起', rating: 4, audience: ['收藏', '自用'], img: 'product_coach_japan', imgExt: 'png', buy: sharedBuy.luxury, why: '日本中古体系成熟，适合找成色好、附件全的经典款。', highlights: ['看成色等级和附件', '尽量选连锁中古店', '价格要和国内二手行情对比'] },
  { id: 'luxury_seiko_watch', cat: '奢侈品', name: 'Seiko Presage / Prospex 腕表', en: 'Seiko Watch', jp: 'セイコー 腕時計', tag: '腕表', short: '日系腕表适合自用和送长辈', jpy: '¥55,000–180,000', cny: '约合 ¥2,299–7,524', rating: 4, audience: ['自用', '送爸爸'], img: 'product_coach_japan', imgExt: 'png', buy: sharedBuy.luxury, why: '日本腕表选择完整，适合在百货和电器店对比。', highlights: ['注意保修类型', '机械表建议现场试戴', '礼物属性强'] },

  { id: 'drug_lulu_attack', cat: '药品常备', name: 'Lulu Attack 感冒药', en: 'Lulu Attack', jp: 'ルルアタック', tag: '感冒常备', short: '换季旅行常被加入药妆清单', jpy: '¥1,500–2,500', cny: '约合 ¥63–105', rating: 4, audience: ['自用', '家庭常备'], img: 'product_pabron', imgExt: 'png', buy: sharedBuy.drug, why: '适合作为常备药清单参考，实际购买需按个人情况和说明书使用。', highlights: ['不要和同类成分叠加', '儿童/孕妇需谨慎', '药师咨询更稳'] },
  { id: 'drug_cabagin_plus', cat: '药品常备', name: 'Cabagin Kowa 胃肠药', en: 'Cabagin Kowa', jp: 'キャベジン', tag: '胃肠护理', short: '吃太多和旅行饮食不规律时常被提到', jpy: '¥1,000–2,200', cny: '约合 ¥42–92', rating: 5, audience: ['自用', '家庭常备'], img: 'product_command_kyabejin', imgExt: 'png', buy: sharedBuy.drug, why: '药妆攻略高频常备药，适合提前了解但不能替代医生建议。', highlights: ['按说明书服用', '胃病长期症状需就医', '适合药妆店补货'] },
  { id: 'drug_sante_gold', cat: '药品常备', name: '参天 Gold / FX 眼药水', en: 'Sante Eye Drops', jp: 'サンテ', tag: '眼部护理', short: '长时间看手机和旅行疲劳可备', jpy: '¥600–1,500', cny: '约合 ¥25–63', rating: 5, audience: ['自用', '办公室'], img: 'product_sante_fx', imgExt: 'png', buy: sharedBuy.drug, why: '眼药水是药妆店高频囤货项，注意清凉度和适应人群。', highlights: ['清凉度差异大', '隐形眼镜需确认可用类型', '轻便好带'] },
  { id: 'drug_hisamitsu_patch', cat: '药品常备', name: '久光 Salonpas 贴布', en: 'Hisamitsu Salonpas', jp: 'サロンパス', tag: '酸痛贴布', short: '长辈和运动后都常用', jpy: '¥500–1,200', cny: '约合 ¥21–50', rating: 4, audience: ['送长辈', '自用'], img: 'product_voltaren_ex', imgExt: 'png', buy: sharedBuy.drug, why: '贴布类轻便好带，但皮肤敏感人群应先小面积测试。', highlights: ['注意温感/冷感区别', '皮肤敏感谨慎', '适合药妆凑单'] },

  { id: 'accessory_casio_gshock', cat: '时尚饰品', name: 'CASIO G-SHOCK 日本限定', en: 'CASIO G-SHOCK', jp: 'ジーショック', tag: '腕表饰品', short: '耐用又有街头感，男生礼物很稳', jpy: '¥12,000–35,000', cny: '约合 ¥502–1,463', rating: 5, audience: ['送男友', '自用'], img: 'product_coach_japan', imgExt: 'png', buy: sharedBuy.accessory, why: '日本腕表和限定配色选择多，适合电器店、百货和品牌店对比。', highlights: ['限定色更有纪念感', '耐用适合日常', '确认保修和型号'] },
  { id: 'accessory_jins_zoff', cat: '时尚饰品', name: 'JINS / Zoff 眼镜', en: 'JINS / Zoff Glasses', jp: 'ジンズ / ゾフ', tag: '眼镜', short: '快速配镜、轻便好搭', jpy: '¥5,500–13,000', cny: '约合 ¥230–544', rating: 4, audience: ['自用'], img: 'product_coach_japan', imgExt: 'png', buy: sharedBuy.accessory, why: '日本快时尚眼镜店效率高，适合旅行中顺路配一副。', highlights: ['可选轻量镜框', '复杂度数需预留时间', '适合日常换风格'] },
  { id: 'accessory_shiro_perfume_plus', cat: '时尚饰品', name: 'SHIRO 白茶香水', en: 'SHIRO White Tea', jp: 'シロ ホワイトティー', tag: '香氛', short: '干净温柔，很适合送闺蜜', jpy: '¥4,180–11,000', cny: '约合 ¥175–460', rating: 5, audience: ['自用', '送闺蜜'], img: 'product_shiro_perfume', imgExt: 'png', buy: sharedBuy.accessory, why: '日本香氛中高频出现的清爽路线，门店试香体验更好。', highlights: ['白茶味接受度高', '小规格好带', '适合送礼'] },
  { id: 'accessory_anello_mini', cat: '时尚饰品', name: 'anello 迷你双肩包', en: 'anello Backpack', jp: 'アネロ リュック', tag: '轻便包', short: '亲子、学生和城市旅行都实用', jpy: '¥4,500–8,000', cny: '约合 ¥188–334', rating: 4, audience: ['自用', '亲子'], img: 'product_anello_backpack', imgExt: 'png', buy: sharedBuy.accessory, why: '轻便能装，适合作为旅行副包或日常通勤包。', highlights: ['开口大好拿取', '颜色选择多', '价格友好'] },

  { id: 'makeup_canmake_set', cat: '彩妆美妆', name: 'Canmake 花瓣腮红/高光', en: 'Canmake Cheek / Highlight', jp: 'キャンメイク', tag: '开架彩妆', short: '平价好买，适合现场试色', jpy: '¥700–1,200', cny: '约合 ¥29–50', rating: 5, audience: ['自用', '送闺蜜'], img: 'product_canmake_highlight', imgExt: 'png', buy: sharedBuy.makeup, why: '开架彩妆里性价比高，Loft、PLAZA 和药妆店都容易买到。', highlights: ['颜色选择多', '价格适合凑单', '新手友好'] },
  { id: 'makeup_kate_brow', cat: '彩妆美妆', name: 'KATE 三色眉粉', en: 'KATE Designing Eyebrow', jp: 'ケイト デザイニングアイブロウ', tag: '眉粉', short: '日系自然眉妆经典单品', jpy: '¥1,210 左右', cny: '约合 ¥51', rating: 5, audience: ['自用'], img: 'product_kate_eyebrow', imgExt: 'png', buy: sharedBuy.makeup, why: '长期口碑稳定，适合喜欢自然眉和鼻影的人。', highlights: ['一盒多用', '色号选择简单', '药妆店常见'] },
  { id: 'makeup_cezanne_shadow', cat: '彩妆美妆', name: 'Cezanne 珠光眼影', en: 'Cezanne Eyeshadow', jp: 'セザンヌ アイシャドウ', tag: '眼影', short: '通勤色和小闪片很适合日常', jpy: '¥748–900', cny: '约合 ¥31–38', rating: 4, audience: ['自用', '学生党'], img: 'product_cezanne_eyeshadow', imgExt: 'png', buy: sharedBuy.makeup, why: '便宜好上手，适合想买日系开架彩妆的人。', highlights: ['通勤色不夸张', '小体积好带', '适合搭配 KATE 眉粉'] },
  { id: 'makeup_opera_lip', cat: '彩妆美妆', name: 'OPERA 渲染润唇膏', en: 'OPERA Lip Tint', jp: 'オペラ リップティント', tag: '唇膏', short: '水润显气色，适合日常素颜妆', jpy: '¥1,760 左右', cny: '约合 ¥74', rating: 4, audience: ['自用', '送闺蜜'], img: 'product_opera_lip', imgExt: 'png', buy: sharedBuy.makeup, why: '日系唇膏中很适合通勤和淡妆的选择。', highlights: ['质地水润', '颜色日常', '适合试色后入'] },
]

export const EXTRA_TOP_SHOPPING_IDS = EXTRA_SOUVENIRS.slice(0, 28).map((item) => item.id)
