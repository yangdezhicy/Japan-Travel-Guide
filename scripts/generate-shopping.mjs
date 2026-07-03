import { promises as fs } from 'node:fs'
import { execFileSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const srcDir = path.join(rootDir, 'src')
const dataDir = path.join(srcDir, 'data')
const imagesDir = path.join(rootDir, 'public', 'images')
const indexTsPath = path.join(dataDir, 'index.ts')
const shoppingDataPath = path.join(dataDir, 'shoppingData.ts')

const RMB_RATE = 0.0418

const SHOPPING_CATEGORY_ORDER = [
  '护肤精华',
  '面膜清洁',
  '防晒隔离',
  '日用护理',
  '保健药品',
  '饼干巧克力',
  '糖果软糖',
  '泡面速食',
  '酒水茶饮',
  '厨房家电',
  '个护电器',
  '穿搭服饰',
  '鞋履箱包',
  '文具手账',
  '家居香氛',
  '餐具工艺',
  '动漫手办',
  'IP 周边',
  '母婴用品',
  '伴手礼限定',
]

const SHOPPING_CATEGORY_META = {
  '护肤精华': { icon: 'spa', blurb: '抗初老、修护、提亮都往这类里找，百货专柜和免税店最容易出惊喜价。' },
  '面膜清洁': { icon: 'masks', blurb: '补水、毛孔、卸妆和洁面集中区，药妆店和 Loft 常年回购率高。' },
  '防晒隔离': { icon: 'wb_sunny', blurb: '日本旅行最值得囤的就是防晒隔离，通勤和海岛度假都能闭眼带。' },
  '日用护理': { icon: 'self_care', blurb: '护唇、蒸汽眼罩、口腔护理这一类最适合顺手囤，送同事也不出错。' },
  '保健药品': { icon: 'medication', blurb: '头痛、肠胃、润喉、眼药水等国民常备药都在这里，买前记得看说明。' },
  '饼干巧克力': { icon: 'cookie', blurb: '北海道系和东京站系人气最高，适合送领导、送家人、送同事。' },
  '糖果软糖': { icon: 'cake', blurb: '轻巧不占箱，办公室分着吃很快清空，是最稳妥的小体积伴手礼。' },
  '泡面速食': { icon: 'ramen_dining', blurb: '深夜嘴馋和回国想念日本味道时最治愈，箱子有空间就值得带。' },
  '酒水茶饮': { icon: 'local_bar', blurb: '清酒、抹茶、茶包和限定啤酒组合，是大人向的高质感战利品。' },
  '厨房家电': { icon: 'rice_bowl', blurb: '电饭煲、烤面包机和小家电是差价最明显的一档，适合认真做功课后下手。' },
  '个护电器': { icon: 'blender', blurb: '吹风机、美容仪、直发器很适合自用升级，机场补货率也不低。' },
  '穿搭服饰': { icon: 'checkroom', blurb: '基础款、日系设计和季节联名很强，适合补一波旅行穿搭。' },
  '鞋履箱包': { icon: 'backpack', blurb: '鞋、包、行李箱都能在这一栏一次看齐，适合买一件长期陪伴型单品。' },
  '文具手账': { icon: 'edit_note', blurb: '钢笔、手账、限定本册和高颜值笔款，文具控很容易在这里失守。' },
  '家居香氛': { icon: 'deceased', blurb: '香水、线香、扩香和小夜灯都很出片，送闺蜜、送自己都很稳。' },
  '餐具工艺': { icon: 'diamond', blurb: '日本手作感和送礼体面度都在线，适合挑一件真正带回家的纪念。' },
  '动漫手办': { icon: 'toys', blurb: '机甲、手办、模型和限定周边最集中，秋叶原和中野百老汇补货率高。' },
  'IP 周边': { icon: 'pets', blurb: 'Pokemon、Sanrio、吉卜力和 Kirby 都是高频出镜区，拍照也很可爱。' },
  '母婴用品': { icon: 'child_care', blurb: '奶瓶、尿布、辅食和宝宝护理品适合按清单扫货，品类稳定又实用。' },
  '伴手礼限定': { icon: 'redeem', blurb: '东京站、机场和区域限定款集中地，临走前补货最省脑细胞。' },
}

const CATEGORY_PLACEHOLDERS = {
  '护肤精华': ['cat_cosmetics_1', 'cat_cosmetics_2', 'cat_cosmetics_3'],
  '面膜清洁': ['cat_cosmetics_2', 'cat_cosmetics_3', 'cat_cosmetics_1'],
  '防晒隔离': ['cat_cosmetics_3', 'cat_cosmetics_1', 'cat_cosmetics_2'],
  '日用护理': ['cat_drugstore_1', 'cat_drugstore_2', 'cat_drugstore_3'],
  '保健药品': ['cat_drugstore_2', 'cat_drugstore_1', 'cat_drugstore_3'],
  '饼干巧克力': ['cat_snack_1', 'cat_snack_2', 'cat_snack_3'],
  '糖果软糖': ['cat_snack_2', 'cat_snack_3', 'cat_snack_1'],
  '泡面速食': ['cat_snack_3', 'cat_snack_1', 'cat_snack_2'],
  '酒水茶饮': ['cat_tea_1', 'cat_tea_2'],
  '厨房家电': ['cat_appliance_1', 'cat_appliance_2'],
  '个护电器': ['cat_appliance_2', 'cat_appliance_1'],
  '穿搭服饰': ['cat_fashion_1', 'cat_fashion_2'],
  '鞋履箱包': ['cat_bags_1', 'cat_bags_2'],
  '文具手账': ['cat_stationery_1', 'cat_stationery_2'],
  '家居香氛': ['cat_stationery_2', 'cat_craft_1'],
  '餐具工艺': ['cat_craft_1', 'cat_craft_2'],
  '动漫手办': ['cat_anime_1', 'cat_anime_2'],
  'IP 周边': ['cat_anime_2', 'cat_anime_1'],
  '母婴用品': ['cat_baby_1', 'cat_baby_2'],
  '伴手礼限定': ['cat_snack_1', 'cat_snack_2', 'cat_snack_3'],
}

const CATEGORY_COLORS = {
  '护肤精华': ['#F5EEE8', '#B45374', '#FFF7F8'],
  '面膜清洁': ['#F2F5EE', '#4D7C5A', '#F8FFF4'],
  '防晒隔离': ['#FFF4D8', '#E6A700', '#FFFDF6'],
  '日用护理': ['#EAF4F6', '#2F7B88', '#F6FEFF'],
  '保健药品': ['#EFF3FF', '#4668C8', '#F8FAFF'],
  '饼干巧克力': ['#FFF1E7', '#B9693D', '#FFF8F3'],
  '糖果软糖': ['#FFEAF4', '#C74B8A', '#FFF7FB'],
  '泡面速食': ['#FFF0DD', '#D97706', '#FFF9F1'],
  '酒水茶饮': ['#EAF6EF', '#2A6F4E', '#F7FFFA'],
  '厨房家电': ['#F3F0FF', '#6C59B7', '#FAF7FF'],
  '个护电器': ['#ECF5FF', '#3178C6', '#F8FBFF'],
  '穿搭服饰': ['#F8EFF3', '#934E6B', '#FFF9FC'],
  '鞋履箱包': ['#EEE9E4', '#6B5B4A', '#FCFAF8'],
  '文具手账': ['#EEF4FB', '#3D6A99', '#FAFCFF'],
  '家居香氛': ['#F5F1FB', '#7B5FB9', '#FCFAFF'],
  '餐具工艺': ['#F3EEE8', '#8C6239', '#FEFAF6'],
  '动漫手办': ['#EEF1FF', '#5C6AC4', '#FAFBFF'],
  'IP 周边': ['#FFF1F6', '#D14D84', '#FFF9FC'],
  '母婴用品': ['#EEF9F3', '#4AA174', '#FBFFFD'],
  '伴手礼限定': ['#FFF4EE', '#D06D45', '#FFF9F6'],
}

const BUY_TEMPLATES = {
  '护肤精华': [
    { n: '伊势丹 / 三越美妆楼层', a: '东京 / 京都 / 大阪百货', note: '热门精华套装与免税组合更齐' },
    { n: '@cosme TOKYO', a: '原宿 / 线上线下联动', note: '适合先试再买' },
    { n: '机场免税店', a: '成田 / 羽田 / 关西', note: '临走前补货最省心' },
  ],
  '面膜清洁': [
    { n: '松本清 / SUNDRUG', a: '全国药妆连锁', note: '补货率高，常有满额免税' },
    { n: 'Loft / Hands', a: '东京 / 大阪 / 京都', note: '限定版本和礼盒更全' },
    { n: '唐吉诃德', a: '各大商圈', note: '深夜扫货友好' },
  ],
  '防晒隔离': [
    { n: '药妆店防晒专区', a: '松本清 / 鹤羽 / SUNDRUG', note: '金瓶和隔离经常堆头补货' },
    { n: '@cosme TOKYO', a: '原宿', note: '适合比质地和色号' },
    { n: '机场免税店', a: '成田 / 羽田 / 关西', note: '最后补货很方便' },
  ],
  '日用护理': [
    { n: '松本清 / 鹤羽药妆', a: '全国', note: '护唇和口腔护理常年有折扣' },
    { n: '唐吉诃德', a: '涉谷 / 新宿 / 道顿堀', note: '夜间也能补货' },
    { n: '便利店 / Loft', a: '核心商圈', note: '小件日用品顺手就能带走' },
  ],
  '保健药品': [
    { n: '大型药妆店 OTC 专区', a: '松本清 / 大国药妆', note: '买前记得确认适应症' },
    { n: '唐吉诃德', a: '新宿 / 秋叶原 / 难波', note: '24 小时门店很适合补单' },
    { n: '机场药妆店', a: '羽田 / 关西 / 新千岁', note: '离境前补货方便' },
  ],
  '饼干巧克力': [
    { n: '东京站一番街 / 大丸地下', a: '东京站 / 大阪站 / 札幌站', note: '送同事不出错的一层最集中' },
    { n: '新千岁机场 / 羽田机场', a: '北海道 / 东京', note: '区域限定和礼盒最全' },
    { n: '百货食品楼层', a: '伊势丹 / 三越 / 高岛屋', note: '包装完整，送礼更体面' },
  ],
  '糖果软糖': [
    { n: '便利店零食墙', a: '7-Eleven / Lawson / FamilyMart', note: '新口味上新快' },
    { n: '药妆店零食区', a: '松本清 / 唐吉诃德', note: '价格通常更友好' },
    { n: '机场伴手礼店', a: '东京 / 大阪 / 冲绳', note: '限定包装适合带回国' },
  ],
  '泡面速食': [
    { n: '超市 / Donki 食品区', a: 'AEON / Life / 唐吉诃德', note: '箱装更划算' },
    { n: '东京站 / 大阪站伴手礼区', a: '站内商场', note: '联名盒装版本多' },
    { n: '机场食品店', a: '成田 / 羽田 / 关西', note: '最后补货很方便' },
  ],
  '酒水茶饮': [
    { n: '百货酒类专柜', a: '伊势丹 / 高岛屋 / 阪急', note: '清酒和抹茶礼盒更全' },
    { n: '机场免税店', a: '成田 / 羽田 / 关西', note: '獭祭和威士忌最容易在此补货' },
    { n: '京都宇治 / 东京日本桥茶铺', a: '丸久小山园 / 一保堂等', note: '想买正统抹茶就直接冲本店' },
  ],
  '厨房家电': [
    { n: 'Bic Camera / Yodobashi', a: '新宿 / 秋叶原 / 梅田', note: '电压与退税都能现场问清楚' },
    { n: '爱电王 / 山田电机', a: '大阪 / 东京', note: '小家电价格常常更狠' },
    { n: '机场免税电器店', a: '羽田 / 关西', note: '适合最后比价' },
  ],
  '个护电器': [
    { n: 'Bic Camera 美容家电区', a: '有乐町 / 新宿 / 难波', note: '现场试机体验最好' },
    { n: 'Yodobashi Camera', a: '秋叶原 / 梅田', note: '常有积分和套装' },
    { n: '机场免税店', a: '成田 / 关西', note: '热门吹风机补货率高' },
  ],
  '穿搭服饰': [
    { n: 'Lumine / Parco / 阪急', a: '东京 / 大阪', note: '日系品牌最集中' },
    { n: '涩谷 / 表参道选物店', a: '东京', note: '设计感和限定配色多' },
    { n: 'Outlet', a: '御殿场 / 临空城', note: '想捡折扣可以留半天' },
  ],
  '鞋履箱包': [
    { n: '表参道 / 银座旗舰店', a: 'Onitsuka Tiger / Porter 等', note: '热门颜色尺寸最齐' },
    { n: '百货箱包楼层', a: '高岛屋 / 伊势丹 / 阪急', note: '试背、退税和售后更省心' },
    { n: 'Outlets', a: '御殿场 / 关西临空', note: '箱包与鞋款折扣不错' },
  ],
  '文具手账': [
    { n: '银座伊东屋', a: '东京银座', note: '钢笔和高颜值文具闭眼逛' },
    { n: 'Traveler\'s Factory / Loft', a: '中目黑 / 东京站 / 京都', note: '限定本册很好买' },
    { n: 'Hands / 百货文具层', a: '东京 / 大阪 / 京都', note: '联名和季节款最丰富' },
  ],
  '家居香氛': [
    { n: 'Shiro / 无印良品', a: '银座 / 札幌 / 京都', note: '香味试闻体验最好' },
    { n: 'Loft / 家居选物店', a: '东京 / 大阪', note: '线香和扩香器款式多' },
    { n: '机场礼品店', a: '札幌 / 东京 / 冲绳', note: '轻便香氛适合最后补货' },
  ],
  '餐具工艺': [
    { n: '日本桥 / 京都工艺店', a: 'COREDO 日本桥 / 清水坂周边', note: '适合挑送礼级单品' },
    { n: '百货生活器物层', a: '伊势丹 / 高岛屋 / 阪急', note: '品牌与包装都更完整' },
    { n: '机场精品伴手礼店', a: '羽田 / 新千岁', note: '小尺寸礼盒方便带走' },
  ],
  '动漫手办': [
    { n: '秋叶原 / 中野百老汇', a: '东京', note: '补货率和中古宝藏都高' },
    { n: 'Animate / Mandarake', a: '池袋 / 梅田 / 名古屋', note: '人气系列很全' },
    { n: '大型电器店模型区', a: 'Yodobashi / Bic', note: '新品上市速度快' },
  ],
  'IP 周边': [
    { n: 'Pokemon Center / Kiddy Land', a: '涩谷 / 池袋 / 梅田', note: '限定周边最值得蹲' },
    { n: '橡子共和国 / Sanrio 门店', a: '东京站 / 京都 / 大阪', note: '拍照和购物都很治愈' },
    { n: '东京站角色街', a: 'JR 东京站一番街', note: '临走前补货极方便' },
  ],
  '母婴用品': [
    { n: '阿卡将本铺', a: '全国大型商场', note: '婴幼儿用品最全' },
    { n: '西松屋 / BabiesRUs', a: '郊区商场', note: '价格通常更友好' },
    { n: 'AEON / 药妆店', a: '全国', note: '尿布和湿巾很好补货' },
  ],
  '伴手礼限定': [
    { n: '东京站一番街 / 新宿站', a: '东京核心交通枢纽', note: '限定款最密集' },
    { n: '机场伴手礼区', a: '羽田 / 成田 / 关西 / 新千岁', note: '回国前补礼盒最方便' },
    { n: '百货甜品层', a: '伊势丹 / 阪急 / 高岛屋', note: '包装完整，适合正式送礼' },
  ],
}

const renameMap = {
  shiseido_ultimune: { name: '资生堂红腰子', short: '维稳界高频回购的经典肌底精华' },
  cpb_veil: { name: 'CPB 长管隔离', short: '妆前提气色、通勤党很爱的贵妇隔离' },
  anessa: { name: 'Anessa 金瓶', short: '去海边和暴走日都能稳住的防晒金瓶' },
  eve_quick: { name: 'EVE 头痛药', short: '药妆店高频断货的国民止痛药' },
  dhc_lip: { name: 'DHC 护唇膏', short: '送同事和闺蜜都不踩雷的护唇膏' },
  royce: { name: 'Royce 生巧', short: '冰箱里常年有一盒的北海道生巧' },
  kitkat: { name: 'KitKat 抹茶', short: '游客闭眼带的经典抹茶巧克力' },
  jagapokkuru: { name: '薯条三兄弟', short: '北海道限定感最强的咸香薯条' },
  panasonic_dryer: { name: '松下负离子吹风机', short: '回国后也会持续幸福感很高的吹风机' },
  balmuda_toaster: { name: 'BALMUDA 烤面包机', short: '早餐党一用就回不去的蒸汽烤面包机' },
  midori_tn: { name: 'Midori Traveler\'s Notebook', short: '文具控去日本几乎都会带回的一本旅人手账' },
  pikachu_figure: { name: 'Pokemon Center 皮卡丘', short: '看见就想拍照带走的宝可梦门店人气款' },
  hellokitty: { name: 'Sanrio / Hello Kitty 周边', short: '少女心和办公室送礼都稳的经典 IP 周边' },
  muji_planner: { name: 'MUJI Planner', short: '通勤人最爱、排版清爽的无印良品手账本' },
  pigeon_bottle: { name: 'Pigeon 奶瓶', short: '母婴攻略里常被反复提到的安心奶瓶' },
  merries_diaper: { name: 'Merries 尿布', short: '柔软度和透气度都很稳的高频母婴采购项' },
}

const extraSeeds = [
  { id: 'decorte_liposome', cat: '护肤精华', name: '黛珂 Liposome 修护精华', en: 'DECORTE Liposome', jp: 'リポソーム', tag: '修护精华', short: '夜间修护感很强的保湿精华', price: 12100, rating: 5, audience: ['自用', '送闺蜜'] },
  { id: 'haku_melano', cat: '护肤精华', name: 'HAKU 美白精华', en: 'HAKU Melano Focus', jp: 'HAKU メラノフォーカス', tag: '淡斑提亮', short: '想抓住日系美白线就会看到它', price: 11000, rating: 5, audience: ['自用', '送妈妈'] },
  { id: 'obagi_c25', cat: '护肤精华', name: 'Obagi C25 精华', en: 'Obagi C25 Serum', jp: 'オバジ C25', tag: 'VC 精华', short: '油皮和毛孔党会主动回购的高浓 VC', price: 11000, rating: 4, audience: ['自用'] },
  { id: 'elixir_daycare', cat: '护肤精华', name: '怡丽丝尔胶原日霜', en: 'ELIXIR Day Care Revolution', jp: 'エリクシール', tag: '日间精华', short: '通勤妆前一支搞定的高口碑日霜', price: 3740, rating: 4, audience: ['自用', '送妈妈'] },

  { id: 'keana_rice_mask', cat: '面膜清洁', name: '毛穴抚子大米面膜', en: 'Keana Rice Mask', jp: '毛穴撫子 お米のマスク', tag: '补水毛孔', short: '药妆店常年热卖的补水面膜', price: 715, rating: 5, audience: ['自用', '送闺蜜'] },
  { id: 'lululun_premium', cat: '面膜清洁', name: 'LuLuLun 地区限定面膜', en: 'LuLuLun Premium', jp: 'ルルルン', tag: '地区限定', short: '一边旅行一边收限定包装的快乐面膜', price: 1760, rating: 4, audience: ['伴手礼', '送闺蜜'] },
  { id: 'fancl_powder', cat: '面膜清洁', name: 'FANCL 洁颜粉', en: 'FANCL Washing Powder', jp: 'ファンケル 洗顔パウダー', tag: '酵素洁面', short: '怕闷痘和闭口的人很难绕开的洁颜粉', price: 1980, rating: 5, audience: ['自用'] },
  { id: 'duo_cleansing', cat: '面膜清洁', name: 'DUO 卸妆膏', en: 'DUO Cleansing Balm', jp: 'デュオ', tag: '卸妆清洁', short: '旅行箱里很适合带一罐的卸妆膏', price: 3960, rating: 4, audience: ['自用'] },

  { id: 'allie_uv', cat: '防晒隔离', name: 'ALLIE 持采防晒', en: 'ALLIE Chrono Beauty', jp: 'アリィー', tag: '通勤防晒', short: '不想太油时很多人会转投 ALLIE', price: 2640, rating: 5, audience: ['自用', '送闺蜜'] },
  { id: 'biore_uv_athlizm', cat: '防晒隔离', name: 'Biore UV Athlizm', en: 'Biore UV Athlizm', jp: 'ビオレUV アスリズム', tag: '高倍防晒', short: '夏天暴晒和暴走行程都很扛打', price: 1980, rating: 4, audience: ['自用'] },
  { id: 'canmake_mermaid', cat: '防晒隔离', name: 'CANMAKE 美人鱼隔离', en: 'Canmake Mermaid UV', jp: 'キャンメイク', tag: '提亮隔离', short: '平价里很会给皮肤打灯的一支', price: 770, rating: 4, audience: ['学生党', '送闺蜜'] },
  { id: 'sofina_primavista', cat: '防晒隔离', name: 'Sofina Primavista 妆前乳', en: 'Primavista Primer', jp: 'プリマヴィスタ', tag: '控油妆前', short: '油皮夏季底妆很容易直接点名它', price: 3080, rating: 4, audience: ['自用'] },

  { id: 'systema_premium', cat: '日用护理', name: 'Systema 旗舰牙刷', en: 'Lion Systema Premium', jp: 'システマ プレミアム', tag: '口腔护理', short: '细毛刷头很适合顺手囤一把', price: 420, rating: 4, audience: ['自用', '送同事'] },
  { id: 'lion_whitetoothpaste', cat: '日用护理', name: '狮王美白牙膏', en: 'Lion Brilliant More', jp: 'ブリリアントモア', tag: '亮白牙膏', short: '办公室同事很爱分装带回的牙膏', price: 980, rating: 4, audience: ['自用', '送同事'] },
  { id: 'kobayashi_night_patch', cat: '日用护理', name: '小林足贴夜用款', en: 'Kobayashi Night Patch', jp: '足リラシート', tag: '放松护理', short: '暴走行程结束后贴上去很解压', price: 880, rating: 4, audience: ['自用', '送长辈'] },
  { id: 'utena_lip_mask', cat: '日用护理', name: 'Utena 夜间唇膜', en: 'Utena Lip Essence', jp: 'ウテナ', tag: '唇部修护', short: '秋冬干嘴唇很容易一试成主顾', price: 880, rating: 4, audience: ['自用', '送闺蜜'] },

  { id: 'sante_fx', cat: '保健药品', name: '参天 FX 眼药水', en: 'Sante FX Neo', jp: 'サンテFX', tag: '提神眼药水', short: '熬夜赶路党几乎都会带一瓶', price: 650, rating: 4, audience: ['自用', '送同事'] },
  { id: 'rohto_lycee', cat: '保健药品', name: '乐敦 Lycee 眼药水', en: 'Rohto Lycee', jp: 'ロートリセ', tag: '温和眼药水', short: '女生向攻略里出镜率很高的眼药水', price: 748, rating: 4, audience: ['自用', '送闺蜜'] },
  { id: 'command_kyabejin', cat: '保健药品', name: 'Cabagin Kowa 胃肠药', en: 'Cabagin Kowa', jp: 'キャベジン', tag: '肠胃调理', short: '暴吃烧肉和拉面后很有安全感', price: 1780, rating: 4, audience: ['自用', '送长辈'] },
  { id: 'yunker_ex', cat: '保健药品', name: 'Yunker 参鸡精饮', en: 'Yunker EX', jp: 'ユンケル', tag: '提神补给', short: '旅行最后两天容易想来一瓶的补给饮', price: 1080, rating: 4, audience: ['自用', '送爸爸'] },

  { id: 'letao_fromage', cat: '饼干巧克力', name: 'LeTAO 双层芝士蛋糕', en: 'LeTAO Fromage Double', jp: 'ルタオ', tag: '北海道甜点', short: '冰着吃最惊艳的北海道经典甜点', price: 2160, rating: 5, audience: ['伴手礼', '送家人'] },
  { id: 'meiji_meltykiss', cat: '饼干巧克力', name: '明治 Meltykiss', en: 'Meltykiss', jp: 'メルティーキッス', tag: '冬季巧克力', short: '入口即化、很有冬天氛围感的巧克力', price: 398, rating: 4, audience: ['送同事', '伴手礼'] },
  { id: 'bourbon_alfort', cat: '饼干巧克力', name: 'Bourbon Alfort 帆船巧克力', en: 'Bourbon Alfort', jp: 'アルフォート', tag: '国民零食', short: '便宜又稳的办公室分食向零食', price: 268, rating: 4, audience: ['送同事', '伴手礼'] },
  { id: 'tokyo_campanella', cat: '饼干巧克力', name: '东京晴空恋巧', en: 'Tokyo Campanella', jp: '東京カンパネラ', tag: '轻脆夹心', short: '包装很秀气、送客户也体面的东京系伴手礼', price: 1458, rating: 4, audience: ['伴手礼', '送客户'] },

  { id: 'cororo_grape', cat: '糖果软糖', name: 'UHA CORORO 葡萄软糖', en: 'UHA Cororo Grape', jp: 'コロロ', tag: '果汁软糖', short: '果汁感很强，很多人一试就连续回购', price: 148, rating: 4, audience: ['送同事', '伴手礼'] },
  { id: 'pure_gummy', cat: '糖果软糖', name: 'Pure 柠檬软糖', en: 'Pure Gummy Lemon', jp: 'ピュレグミ', tag: '酸甜软糖', short: '酸甜平衡很好，路上提神也合适', price: 162, rating: 4, audience: ['伴手礼', '学生党'] },
  { id: 'hi_chew_premium', cat: '糖果软糖', name: 'Hi-Chew Premium', en: 'Hi-Chew Premium', jp: 'ハイチュウ', tag: '国民软糖', short: '地区限定口味很多，盲买也不容易出错', price: 298, rating: 4, audience: ['送同事', '伴手礼'] },
  { id: 'kanro_milk', cat: '糖果软糖', name: 'Kanro 牛奶糖', en: 'Kanro Milk Candy', jp: 'カンロ', tag: '奶味硬糖', short: '很适合长辈和小朋友都能接受的味型', price: 198, rating: 4, audience: ['送长辈', '伴手礼'] },

  { id: 'ichiran_box', cat: '泡面速食', name: '一兰拉面盒装', en: 'Ichiran Ramen Kit', jp: '一蘭', tag: '经典拉面', short: '回国后最能瞬间把味觉拉回日本的一盒', price: 1980, rating: 5, audience: ['自用', '送朋友'] },
  { id: 'nissin_donbei', cat: '泡面速食', name: '日清兵卫豆皮乌冬', en: 'Nissin Donbei', jp: 'どん兵衛', tag: '日式乌冬', short: '下雨天和酒店夜宵都很治愈的经典泡面', price: 248, rating: 4, audience: ['自用', '伴手礼'] },
  { id: 'ippudo_box', cat: '泡面速食', name: '一风堂拉面礼盒', en: 'Ippudo Ramen Box', jp: '一風堂', tag: '豚骨礼盒', short: '送爱吃面的人，基本都会被夸会买', price: 1350, rating: 4, audience: ['送朋友', '自用'] },
  { id: 'marutai_tonkotsu', cat: '泡面速食', name: 'Marutai 九州棒拉面', en: 'Marutai Ramen', jp: 'マルタイ', tag: '九州风味', short: '价格很友好，箱里塞几包完全不心疼', price: 278, rating: 4, audience: ['自用', '伴手礼'] },

  { id: 'suntory_yamazaki_mini', cat: '酒水茶饮', name: '山崎威士忌迷你瓶', en: 'Yamazaki Mini', jp: '山崎', tag: '威士忌', short: '遇见小瓶装就很适合先带回去试味道', price: 1980, rating: 4, audience: ['送爸爸', '送客户'] },
  { id: 'itoen_oi_tea', cat: '酒水茶饮', name: '伊藤园 Oi Ocha 茶包', en: 'Oi Ocha Tea Bag', jp: 'おーいお茶', tag: '日常茶饮', short: '便宜好带，是自留型茶包代表', price: 648, rating: 4, audience: ['自用', '送同事'] },
  { id: 'ippodo_matcha', cat: '酒水茶饮', name: '一保堂抹茶', en: 'Ippodo Matcha', jp: '一保堂', tag: '京都茶铺', short: '想送有品位的朋友，抹茶一定有它一票', price: 2160, rating: 4, audience: ['送朋友', '送客户'] },
  { id: 'yebisu_beer_pack', cat: '酒水茶饮', name: '惠比寿啤酒礼盒', en: 'Yebisu Beer Set', jp: 'ヱビス', tag: '啤酒礼盒', short: '很适合节假日带回去和家人分享', price: 1320, rating: 4, audience: ['送爸爸', '自用'] },

  { id: 'tiger_kettle', cat: '厨房家电', name: 'Tiger 电热水壶', en: 'Tiger Electric Kettle', jp: 'タイガー', tag: '日常家电', short: '体积不大、带回国也很有使用率的小家电', price: 8800, rating: 4, audience: ['自用', '送爸妈'] },
  { id: 'bruno_hotplate', cat: '厨房家电', name: 'BRUNO 多功能料理盘', en: 'BRUNO Hot Plate', jp: 'ブルーノ', tag: '颜值家电', short: '聚餐和早餐都会用到的高颜值料理盘', price: 12100, rating: 4, audience: ['自用', '送新婚朋友'] },
  { id: 'vitantonio_sandwich', cat: '厨房家电', name: 'Vitantonio 三明治机', en: 'Vitantonio Sandwich Maker', jp: 'ビタントニオ', tag: '早餐神器', short: '很适合做露营风早餐的轻巧机器', price: 7700, rating: 4, audience: ['自用'] },
  { id: 'iris_rice_cooker', cat: '厨房家电', name: 'IRIS 小型电饭煲', en: 'IRIS Rice Cooker', jp: 'アイリスオーヤマ', tag: '租房友好', short: '一个人住也不会嫌大的入门电饭煲', price: 9980, rating: 4, audience: ['自用'] },

  { id: 'refa_straight_iron', cat: '个护电器', name: 'ReFa 直发夹', en: 'ReFa Straight Iron', jp: 'リファ', tag: '造型电器', short: '女生攻略里经常和吹风机一起出现的单品', price: 22000, rating: 4, audience: ['自用', '送闺蜜'] },
  { id: 'panasonic_shaver', cat: '个护电器', name: '松下电动剃须刀', en: 'Panasonic Shaver', jp: 'パナソニック', tag: '男士护理', short: '送男友和爸爸都很稳的实用型礼物', price: 16800, rating: 4, audience: ['送爸爸', '送男友'] },
  { id: 'yaman_beauty', cat: '个护电器', name: 'YA-MAN 美容仪', en: 'YA-MAN Beauty Device', jp: 'ヤーマン', tag: '美容仪', short: '想升级居家护肤仪式感时很容易锁定它', price: 33000, rating: 4, audience: ['自用'] },
  { id: 'salonia_2way', cat: '个护电器', name: 'SALONIA 两用卷直发棒', en: 'SALONIA 2Way Iron', jp: 'サロニア', tag: '平价造型', short: '价格轻盈但出门造型很够用的一支', price: 4378, rating: 4, audience: ['学生党', '自用'] },

  { id: 'uniqlo_heattech', cat: '穿搭服饰', name: '优衣库 HEATTECH 内搭', en: 'UNIQLO HEATTECH', jp: 'ヒートテック', tag: '冬季基础款', short: '去冬天日本玩顺手补货真的很合理', price: 1500, rating: 4, audience: ['自用', '送家人'] },
  { id: 'beams_cap', cat: '穿搭服饰', name: 'BEAMS 刺绣棒球帽', en: 'BEAMS Cap', jp: 'ビームス', tag: '日系穿搭', short: '照片里很出片、回国也很常戴的帽子', price: 4950, rating: 4, audience: ['自用', '送男友'] },
  { id: 'snidel_dress', cat: '穿搭服饰', name: 'SNIDEL 连衣裙', en: 'SNIDEL Dress', jp: 'スナイデル', tag: '约会穿搭', short: '逛 LUMINE 很容易被这一类款式击中', price: 16940, rating: 4, audience: ['自用', '送闺蜜'] },
  { id: 'wacoal_bra', cat: '穿搭服饰', name: 'Wacoal 内衣', en: 'Wacoal Bra', jp: 'ワコール', tag: '机能内衣', short: '尺寸和版型都很成熟，送自己非常值', price: 6600, rating: 4, audience: ['自用'] },

  { id: 'ace_luggage', cat: '鞋履箱包', name: 'ACE 轻量行李箱', en: 'ACE Luggage', jp: 'エース', tag: '旅行箱', short: '日本本土箱体做工很稳，适合认真选一只', price: 28600, rating: 4, audience: ['自用'] },
  { id: 'anello_backpack', cat: '鞋履箱包', name: 'anello 口金双肩包', en: 'anello Backpack', jp: 'アネロ', tag: '通勤背包', short: '轻巧好背，妈咪包和通勤包都能兼顾', price: 4950, rating: 4, audience: ['自用', '送朋友'] },
  { id: 'porter_girls', cat: '鞋履箱包', name: 'PORTER GIRL 斜挎包', en: 'PORTER GIRL', jp: 'ポーターガール', tag: '尼龙包', short: '想买一只耐用又低调的日系包很值得看', price: 19800, rating: 4, audience: ['自用', '送闺蜜'] },
  { id: 'oriental_traffic_boot', cat: '鞋履箱包', name: 'ORiental TRaffic 短靴', en: 'Oriental Traffic Boots', jp: 'オリエンタルトラフィック', tag: '通勤短靴', short: '对脚型友好、很好搭裙装和风衣', price: 8800, rating: 4, audience: ['自用'] },

  { id: 'hobonichi_2026', cat: '文具手账', name: 'Hobonichi 2026 手账', en: 'Hobonichi Techo', jp: 'ほぼ日手帳', tag: '年度手账', short: '手账圈几乎每年都会讨论的一本', price: 2750, rating: 4, audience: ['自用', '送文具控'] },
  { id: 'kokuyo_campus', cat: '文具手账', name: 'KOKUYO Campus 限定本', en: 'Kokuyo Campus', jp: 'キャンパスノート', tag: '学生党文具', short: '颜值和实用性都很稳，带几本不占位置', price: 220, rating: 4, audience: ['学生党', '送同事'] },
  { id: 'uni_jetstream4', cat: '文具手账', name: 'Uni Jetstream 四色笔', en: 'Jetstream 4&1', jp: 'ジェットストリーム', tag: '顺滑书写', short: '写起来太顺，会让人立刻想囤替芯', price: 1320, rating: 4, audience: ['送同事', '自用'] },
  { id: 'zebra_sarasa', cat: '文具手账', name: 'Zebra Sarasa 限定色', en: 'Zebra Sarasa', jp: 'サラサ', tag: '彩色中性笔', short: '色系很好看，买一把当伴手礼非常轻松', price: 165, rating: 4, audience: ['学生党', '送同事'] },

  { id: 'shiro_perfume', cat: '家居香氛', name: 'SHIRO 白茶香水', en: 'SHIRO White Tea', jp: 'シロ ホワイトティー', tag: '人气香气', short: '清透不腻，很多人会把它当日本旅行味道', price: 4180, rating: 5, audience: ['自用', '送闺蜜'] },
  { id: 'hibi_incense', cat: '家居香氛', name: 'hibi 火柴线香', en: 'hibi Incense', jp: 'ヒビ', tag: '线香礼物', short: '包装小巧又有记忆点，送人特别体面', price: 935, rating: 5, audience: ['送闺蜜', '送客户'] },
  { id: 'muji_aroma_diffuser', cat: '家居香氛', name: 'MUJI 香薰机', en: 'MUJI Aroma Diffuser', jp: '無印良品 アロマディフューザー', tag: '居家疗愈', short: '把酒店香气搬回家的代表选手', price: 6990, rating: 4, audience: ['自用'] },
  { id: 'nippon_kodo', cat: '家居香氛', name: '日本香堂线香礼盒', en: 'Nippon Kodo Incense', jp: '日本香堂', tag: '和风线香', short: '送长辈和文艺朋友都很有分寸感', price: 1650, rating: 4, audience: ['送长辈', '送朋友'] },

  { id: 'hasami_mug', cat: '餐具工艺', name: '波佐见烧马克杯', en: 'Hasami Mug', jp: '波佐見焼', tag: '日常器皿', short: '很适合给家里换一只耐看又实用的杯子', price: 2200, rating: 4, audience: ['自用', '送朋友'] },
  { id: 'arita_plate', cat: '餐具工艺', name: '有田烧小盘', en: 'Arita Plate', jp: '有田焼', tag: '餐桌器物', short: '小盘子最适合第一次买日本陶器入门', price: 3300, rating: 4, audience: ['自用', '送妈妈'] },
  { id: 'nosaku_tin_cup', cat: '餐具工艺', name: '能作锡杯', en: 'NOUSAKU Tin Cup', jp: '能作', tag: '清酒器', short: '喝酒的人大多会对它有点好感', price: 5500, rating: 4, audience: ['送爸爸', '送客户'] },
  { id: 'kutani_chopsticks', cat: '餐具工艺', name: '九谷烧筷架礼盒', en: 'Kutani Chopstick Rest', jp: '九谷焼', tag: '轻礼工艺', short: '占地小又有日本味，特别适合作伴手礼', price: 2800, rating: 4, audience: ['伴手礼', '送客户'] },

  { id: 'gundam_mg', cat: '动漫手办', name: '高达 MG 模型', en: 'Gundam MG', jp: 'ガンプラ', tag: '机甲模型', short: '秋叶原和台场几乎都会把它列为必逛目标', price: 4950, rating: 5, audience: ['自用', '送男友'] },
  { id: 'onepiece_popp', cat: '动漫手办', name: '海贼王 P.O.P 手办', en: 'One Piece P.O.P', jp: 'ワンピース', tag: '收藏手办', short: '角色厨看到基本很难空手离开', price: 16500, rating: 4, audience: ['自用'] },
  { id: 'nendoroid_miku', cat: '动漫手办', name: '初音未来粘土人', en: 'Nendoroid Miku', jp: 'ねんどろいど 初音ミク', tag: '萌系手办', short: '轻量好带，送二次元朋友特别稳', price: 6900, rating: 4, audience: ['送朋友', '自用'] },
  { id: 'ultraman_softvinyl', cat: '动漫手办', name: '奥特曼软胶玩具', en: 'Ultraman Sofubi', jp: 'ウルトラマン', tag: '童年向收藏', short: '带点昭和情怀，适合送给大朋友', price: 3300, rating: 4, audience: ['送朋友', '送爸爸'] },

  { id: 'ghibli_kaonashi', cat: 'IP 周边', name: '吉卜力无脸男摆件', en: 'Ghibli Kaonashi', jp: 'カオナシ', tag: '吉卜力周边', short: '橡子共和国里最容易被反复拿起的角色周边', price: 3520, rating: 5, audience: ['送闺蜜', '自用'] },
  { id: 'miffy_style', cat: 'IP 周边', name: 'Miffy Style 限定玩偶', en: 'Miffy Style Plush', jp: 'ミッフィー', tag: '限定玩偶', short: '可爱度很高，拍照也很容易出片', price: 2860, rating: 4, audience: ['送闺蜜', '送小朋友'] },
  { id: 'snoopy_town', cat: 'IP 周边', name: 'Snoopy Town 购物袋', en: 'Snoopy Town Bag', jp: 'スヌーピー', tag: '轻便周边', short: '轻、好塞、回国后也很实用的一类', price: 1980, rating: 4, audience: ['送同事', '伴手礼'] },
  { id: 'kirby_cafe_gift', cat: 'IP 周边', name: 'Kirby Cafe 饼干礼盒', en: 'Kirby Cafe Gift', jp: 'カービィ', tag: '联名礼盒', short: '颜值很高，粉色包装天生适合做礼物', price: 2310, rating: 4, audience: ['送闺蜜', '伴手礼'] },

  { id: 'wakodo_baby_food', cat: '母婴用品', name: '和光堂婴儿辅食', en: 'Wakodo Baby Food', jp: '和光堂', tag: '出行辅食', short: '很多宝妈会按口味直接囤一排回家', price: 198, rating: 5, audience: ['送宝妈', '自用'] },
  { id: 'moony_wipes', cat: '母婴用品', name: 'Moony 婴儿湿巾', en: 'Moony Wipes', jp: 'ムーニー', tag: '随身护理', short: '软乎又厚实，旅行带娃很有安全感', price: 880, rating: 4, audience: ['送宝妈', '自用'] },
  { id: 'mama_kids_cream', cat: '母婴用品', name: 'Mama&Kids 面霜', en: 'Mama & Kids Cream', jp: 'ママ&キッズ', tag: '敏感肌护理', short: '孕期和宝宝肌都比较放心的一支', price: 2640, rating: 4, audience: ['送宝妈'] },
  { id: 'pigeon_peach_water', cat: '母婴用品', name: 'Pigeon 桃子水', en: 'Pigeon Peach Water', jp: 'ピジョン 桃の葉ローション', tag: '宝宝护理', short: '夏季带娃攻略里经常会出现的一瓶', price: 880, rating: 4, audience: ['送宝妈', '自用'] },

  { id: 'press_butter_sand', cat: '伴手礼限定', name: 'PRESS BUTTER SAND', en: 'Press Butter Sand', jp: 'プレスバターサンド', tag: '东京站名产', short: '东京站排队率一直很高的黄油夹心饼干', price: 1215, rating: 5, audience: ['伴手礼', '送同事'] },
  { id: 'tokyo_milk_cheese', cat: '伴手礼限定', name: '东京牛奶芝士工厂', en: 'Tokyo Milk Cheese Factory', jp: '東京ミルクチーズ工場', tag: '芝士饼干', short: '带一点咸奶酪风味，接受度特别高', price: 1296, rating: 5, audience: ['伴手礼', '送客户'] },
  { id: 'yoku_moku', cat: '伴手礼限定', name: 'Yoku Moku 雪茄蛋卷', en: 'Yoku Moku Cigare', jp: 'ヨックモック', tag: '经典礼盒', short: '正式送礼非常稳的高雅路线', price: 1458, rating: 4, audience: ['送客户', '送长辈'] },
  { id: 'newyork_perfect_cheese', cat: '伴手礼限定', name: 'NewYork Perfect Cheese', en: 'NewYork Perfect Cheese', jp: 'ニューヨークパーフェクトチーズ', tag: '人气排队款', short: '东京站大热门，很多人专门为了它排队', price: 1782, rating: 4, audience: ['伴手礼', '送朋友'] },
  { id: 'suisai_powder', cat: '面膜清洁', name: 'Suisai 酵素洗颜粉', en: 'Suisai Beauty Clear', jp: 'スイサイ', tag: '酵素洁颜', short: '旅行装和囤货装都很受欢迎的酵素洁颜粉', price: 1320, rating: 4, audience: ['自用', '送闺蜜'] },
  { id: 'skin_aqua_toneup', cat: '防晒隔离', name: 'Skin Aqua 提亮防晒', en: 'Skin Aqua Tone Up UV', jp: 'スキンアクア', tag: '平价提亮', short: '学生党很爱的一支提亮型防晒', price: 1100, rating: 4, audience: ['学生党', '自用'] },
  { id: 'kose_suncut', cat: '防晒隔离', name: 'KOSE Suncut 防晒喷雾', en: 'KOSE Suncut Spray', jp: 'サンカット', tag: '喷雾防晒', short: '补涂方便，头发和身体都能一起照顾', price: 980, rating: 4, audience: ['自用', '送朋友'] },
  { id: 'fettuccine_gummy', cat: '糖果软糖', name: 'Bourbon Fettuccine 软糖', en: 'Fettuccine Gummy', jp: 'フェットチーネグミ', tag: '酸爽软糖', short: '口感很有记忆点，边走边吃非常上头', price: 168, rating: 4, audience: ['送同事', '伴手礼'] },
  { id: 'sakuma_drop', cat: '糖果软糖', name: '佐久间水果糖', en: 'Sakuma Drops', jp: 'サクマドロップス', tag: '复古糖果', short: '复古铁罐和童年感让它特别适合当小礼物', price: 298, rating: 4, audience: ['伴手礼', '送长辈'] },
  { id: 'cupnoodle_curry', cat: '泡面速食', name: '合味道咖喱杯面', en: 'Cup Noodles Curry', jp: 'カップヌードル カレー', tag: '日清杯面', short: '深夜酒店房里来一杯真的很满足', price: 236, rating: 4, audience: ['自用', '伴手礼'] },
  { id: 'cupnoodle_seafood', cat: '泡面速食', name: '合味道海鲜杯面', en: 'Cup Noodles Seafood', jp: 'シーフードヌードル', tag: '经典杯面', short: '经典到几乎所有便利店都能看到它', price: 236, rating: 4, audience: ['自用', '伴手礼'] },
  { id: 'sapporoichiban_miso', cat: '泡面速食', name: '札幌一番味噌拉面', en: 'Sapporo Ichiban Miso', jp: 'サッポロ一番', tag: '袋装拉面', short: '想带回家自己煮一点日本味，选它很稳', price: 658, rating: 4, audience: ['自用', '送朋友'] },
  { id: 'ufo_yakisoba', cat: '泡面速食', name: '日清 UFO 炒面', en: 'Nissin UFO Yakisoba', jp: 'U.F.O.', tag: '炒面杯', short: '重口味爱好者看到它一般都会顺手带一盒', price: 298, rating: 4, audience: ['自用', '伴手礼'] },
  { id: 'tescom_hairiron', cat: '个护电器', name: 'TESCOM 轻量卷发棒', en: 'TESCOM Hair Iron', jp: 'テスコム', tag: '旅行造型', short: '轻便好带，很适合旅行箱里放一支', price: 5480, rating: 4, audience: ['自用', '送闺蜜'] },
  { id: 'ya_man_headspa', cat: '个护电器', name: 'YA-MAN 头皮按摩仪', en: 'YA-MAN Head Spa', jp: 'ミーゼ', tag: '头皮护理', short: '头皮放松和居家护理都很有仪式感', price: 15950, rating: 4, audience: ['自用', '送妈妈'] },
  { id: 'aux_paradis_perfume', cat: '家居香氛', name: 'AUX PARADIS 淡香水', en: 'Aux Paradis Perfume', jp: 'オゥパラディ', tag: '轻香水', short: '很适合喜欢低调留香的人慢慢挑一支', price: 3960, rating: 4, audience: ['自用', '送闺蜜'] },
  { id: 'three_room_mist', cat: '家居香氛', name: 'THREE 房间喷雾', en: 'THREE Room Mist', jp: 'スリー', tag: '空间香气', short: '日系高级感很足，送礼也显得很会挑', price: 4400, rating: 4, audience: ['送闺蜜', '送客户'] },
  { id: 'johnsblend_gel', cat: '家居香氛', name: 'John\'s Blend 香氛膏', en: 'John\'s Blend', jp: 'ジョンズブレンド', tag: '车载香氛', short: '小体积又耐闻，是很实用的香氛小物', price: 990, rating: 4, audience: ['送同事', '伴手礼'] },
  { id: 'cocodor_sachet', cat: '家居香氛', name: '和风香囊挂饰', en: 'Japanese Aroma Sachet', jp: '香り袋', tag: '轻礼香囊', short: '轻巧不占地，带一把回国分送也很轻松', price: 880, rating: 4, audience: ['伴手礼', '送朋友'] },
  { id: 'dragonball_ichiban', cat: '动漫手办', name: '龙珠一番赏手办', en: 'Dragon Ball Ichiban Kuji', jp: '一番くじ ドラゴンボール', tag: '抽赏手办', short: '看到喜欢角色很容易直接冲一套的类型', price: 7900, rating: 4, audience: ['自用', '送朋友'] },
  { id: 'gachapon_capsule_set', cat: '动漫手办', name: '扭蛋限定套组', en: 'Gachapon Capsule Set', jp: 'ガシャポン', tag: '轻收藏', short: '预算不大也能收获快乐的典型二次元小物', price: 1500, rating: 4, audience: ['伴手礼', '送朋友'] },
  { id: 'tokyo_rusk_assort', cat: '伴手礼限定', name: 'Tokyo Rusk 综合礼盒', en: 'Tokyo Rusk Assortment', jp: '東京ラスク', tag: '办公室分送', short: '独立包装很适合带回公司分着吃', price: 1080, rating: 4, audience: ['送同事', '伴手礼'] },
  { id: 'albion_flora_drip', cat: '护肤精华', name: 'ALBION Flora Drip 精华', en: 'ALBION Flora Drip', jp: 'フローラドリップ', tag: '发酵精华', short: '想走贵妇发酵路线时经常会被推荐的一瓶', price: 14300, rating: 4, audience: ['自用', '送妈妈'] },
  { id: 'ipsa_serum0', cat: '护肤精华', name: 'IPSA 0 号精华', en: 'IPSA Serum 0', jp: 'イプサ セラム 0', tag: '平衡精华', short: '偏爱清爽质地的人会更容易喜欢它', price: 11550, rating: 4, audience: ['自用'] },
  { id: 'eva_unit01_figure', cat: '动漫手办', name: 'EVA 初号机模型', en: 'EVA Unit-01 Figure', jp: 'エヴァ初号機', tag: '机甲收藏', short: '机甲爱好者看见配色就很难不多看两眼', price: 8800, rating: 4, audience: ['自用', '送朋友'] }
]

const TOP50_IDS = [
  'skii',
  'shiseido_ultimune',
  'cpb_veil',
  'anessa',
  'eve_quick',
  'ryukakusan',
  'kao_eyemask',
  'dhc_lip',
  'shiroikoibito',
  'royce',
  'tokyobanana',
  'kitkat',
  'jagapokkuru',
  'zojirushi_stan',
  'panasonic_dryer',
  'balmuda_toaster',
  'pilot_custom74',
  'midori_tn',
  'totoro_bag',
  'pikachu_figure',
  'dassai',
  'marukyu_matcha',
  'nambu_tetsubin',
  'edo_kiriko',
  'porter_tanker',
  'onitsuka_tiger',
  'muji_planner',
  'pigeon_bottle',
  'merries_diaper',
  'hellokitty',
  'decorte_liposome',
  'haku_melano',
  'fancl_powder',
  'keana_rice_mask',
  'allie_uv',
  'biore_uv_athlizm',
  'systema_premium',
  'ota_isan',
  'sante_fx',
  'press_butter_sand',
  'tokyo_milk_cheese',
  'yoku_moku',
  'ichiran_box',
  'nissin_donbei',
  'shiro_perfume',
  'hibi_incense',
  'gundam_mg',
  'ghibli_kaonashi',
  'wakodo_baby_food',
  'letao_fromage',
]

const SHOPPING_DISTRICTS = [
  {
    id: 'ginza',
    name: '银座',
    en: 'Ginza',
    city: '东京',
    address: '东京都中央区银座4丁目～6丁目一带',
    hours: '多数百货 10:30–20:30 / 餐饮延长至 22:00 左右',
    tags: ['百货', '美妆', '高端', '伴手礼'],
    desc: '第一次来东京想高效扫大牌、礼盒和体面伴手礼，银座几乎就是闭眼冲。Ginza Six、三越和 MUJI 银座都很适合一站式慢慢逛。',
    nearby: ['GINZA SIX', '银座三越', 'MUJI 银座'],
  },
  {
    id: 'shinjuku_isetan',
    name: '新宿伊势丹',
    en: 'Isetan Shinjuku',
    city: '东京',
    address: '东京都新宿区新宿3-14-1',
    hours: '10:00–20:00',
    tags: ['百货', '美妆', '甜品', '退税'],
    desc: '地下食品层和美妆专柜都很强，想一次买齐送妈妈、送闺蜜、送客户的东西，这里效率很高。',
    nearby: ['LUMINE', '新宿三丁目', '新宿站南口'],
  },
  {
    id: 'shibuya_109',
    name: '涩谷 109',
    en: 'Shibuya 109',
    city: '东京',
    address: '东京都涩谷区道玄坂2-29-1',
    hours: '10:00–21:00',
    tags: ['潮流', '年轻品牌', '美妆', '拍照'],
    desc: '想看日本年轻女生现在在穿什么、背什么，109 还是非常直给。顺路还能把十字路口和涩谷 Sky 一起打卡。',
    nearby: ['涩谷十字路口', 'MAGNET', '宫下公园'],
  },
  {
    id: 'omotesando',
    name: '表参道',
    en: 'Omotesando',
    city: '东京',
    address: '东京都涩谷区神宫前4丁目～5丁目一带',
    hours: '多数店铺 11:00–20:00',
    tags: ['设计师品牌', '买手店', '鞋包', '咖啡'],
    desc: '适合慢慢逛选物店和旗舰店，Onitsuka Tiger、Kiddy Land、香氛和潮流配饰都比较好买，也很适合拍街景。',
    nearby: ['表参道 Hills', '原宿', '明治神宫前'],
  },
  {
    id: 'akihabara',
    name: '秋叶原',
    en: 'Akihabara',
    city: '东京',
    address: '东京都千代田区外神田1丁目一带',
    hours: '多数店铺 10:00–20:00',
    tags: ['动漫', '手办', '电器', '模型'],
    desc: '电器和二次元双线并进的典型商圈，想买模型、游戏、相机和美容小电器都很顺手。',
    nearby: ['Yodobashi Akiba', 'Animate', '扭蛋会馆'],
  },
  {
    id: 'nakano_broadway',
    name: '中野百老汇',
    en: 'Nakano Broadway',
    city: '东京',
    address: '东京都中野区中野5-52-15',
    hours: '多数店铺 12:00–20:00',
    tags: ['中古', '动漫', '模型', '淘宝'],
    desc: '小红书里常被当成“秋叶原平替 + 中古宝库”，想淘限定手办、绝版周边，很适合留出一整个下午。',
    nearby: ['中野太阳商城', 'Mandarake', '中野站北口'],
  },
  {
    id: 'sunshine_city',
    name: '池袋 Sunshine City',
    en: 'Sunshine City',
    city: '东京',
    address: '东京都丰岛区东池袋3-1',
    hours: '商场 10:00–20:00 / 部分餐饮 11:00–22:00',
    tags: ['亲子', '动漫', '百货', '室内综合体'],
    desc: '池袋这类一站式综合体特别适合下雨天。Pokemon Center Mega Tokyo、JUMP SHOP 和餐饮都能一次拿下。',
    nearby: ['Pokemon Center Mega Tokyo', '阳光水族馆', '池袋东口'],
  },
  {
    id: 'ameyoko',
    name: '上野阿美横町',
    en: 'Ameyoko',
    city: '东京',
    address: '东京都台东区上野4-9-14 一带',
    hours: '多数店铺 10:00–20:00',
    tags: ['平价', '药妆', '零食', '市场'],
    desc: '预算党很爱的一站。药妆、零食、干货和行李箱都能一起看，逛起来是热闹而接地气的东京。',
    nearby: ['上野站', '阿美横市场', '多庆屋'],
  },
  {
    id: 'tokyo_station_first_avenue',
    name: '东京站一番街',
    en: 'First Avenue Tokyo Station',
    city: '东京',
    address: '东京都千代田区丸之内1-9-1 JR东京站 B1F / 1F',
    hours: '多数店铺 10:00–20:30',
    tags: ['伴手礼', 'IP', '拉面', '站内商场'],
    desc: '临回国前的补货圣地。角色街、拉面街和点心街都很集中，时间不多时尤其救命。',
    nearby: ['东京角色街', '东京拉面街', '东京 Okashi Land'],
  },
  {
    id: 'coredo_nihonbashi',
    name: '日本桥 COREDO',
    en: 'COREDO Nihonbashi',
    city: '东京',
    address: '东京都中央区日本桥1-4-1',
    hours: '商场 11:00–20:00 / 餐饮 11:00–23:00',
    tags: ['生活方式', '工艺', '清酒', '轻奢'],
    desc: '想买更成熟一点的器物、清酒和生活方式礼物，可以把日本桥排进路线，氛围比热门游客区更从容。',
    nearby: ['日本桥', '高岛屋 S.C.', '三越前站'],
  },
  {
    id: 'shinsaibashi_suji',
    name: '心斋桥筋',
    en: 'Shinsaibashi-suji',
    city: '大阪',
    address: '大阪府大阪市中央区心斋桥筋1丁目～2丁目一带',
    hours: '多数店铺 11:00–20:00',
    tags: ['药妆', '潮流', '百货', '退税'],
    desc: '如果只能在大阪留一个购物主战场，很多人都会选心斋桥。药妆、球鞋和快时尚都够密集，补货效率特别高。',
    nearby: ['美国村', '大丸心斋桥', '御堂筋'],
  },
  {
    id: 'dotonbori',
    name: '道顿堀',
    en: 'Dotonbori',
    city: '大阪',
    address: '大阪府大阪市中央区道顿堀1丁目一带',
    hours: '多数店铺 11:00–23:00',
    tags: ['夜逛', '零食', '药妆', '美食'],
    desc: '边吃边买最有意思的就是这片。固力果招牌、唐吉诃德、药妆店和零食店全都挤在一条线里。',
    nearby: ['戎桥', '唐吉诃德摩天轮', '难波'],
  },
  {
    id: 'namba_takashimaya',
    name: '难波高岛屋',
    en: 'Takashimaya Osaka',
    city: '大阪',
    address: '大阪府大阪市中央区难波5-1-5',
    hours: '10:00–20:00 / 餐饮楼层延长营业',
    tags: ['百货', '美妆', '食品层', '箱包'],
    desc: '想在南海难波站周边直接把高质量伴手礼、化妆品和箱包买齐，高岛屋非常省时间。',
    nearby: ['难波 CITY', '南海难波站', '高岛屋美食层'],
  },
  {
    id: 'hankyu_umeda',
    name: '阪急梅田本店',
    en: 'Hankyu Umeda Main Store',
    city: '大阪',
    address: '大阪府大阪市北区角田町8-7',
    hours: '10:00–20:00 / 12-13F 餐饮 11:00–22:00',
    tags: ['百货', '甜品', '服饰', '高端'],
    desc: '梅田系里最适合认真挑礼物的百货之一，甜品层和女装层都很强，送长辈和送客户的选择特别多。',
    nearby: ['HEP FIVE', 'Grand Front Osaka', '大阪站'],
  },
  {
    id: 'tennoji_mio',
    name: '天王寺 MIO',
    en: 'Tennoji MIO',
    city: '大阪',
    address: '大阪府大阪市天王寺区悲田院町10-39',
    hours: '10:30–20:30 / 部分餐饮延长营业',
    tags: ['年轻品牌', '亲子', '通勤', '站城综合'],
    desc: '适合住在天王寺一带的人当本地补货点。品牌密度高、交通方便，顺路买母婴和通勤服饰都不错。',
    nearby: ['阿倍野 HARUKAS', '天王寺站', '近铁百货'],
  },
  {
    id: 'shijo_kawaramachi',
    name: '四条河原町',
    en: 'Shijo Kawaramachi',
    city: '京都',
    address: '京都府京都市下京区四条通河原町西入真町一带',
    hours: '多数店铺 10:00–20:00',
    tags: ['百货', '京都系选物', '药妆', '美食'],
    desc: '京都想逛得最有效率，四条河原町是绕不开的核心区。高岛屋、藤井大丸、寺町京极都能步行串起来。',
    nearby: ['京都高岛屋', '寺町京极', '新京极'],
  },
  {
    id: 'kyoto_station_isetan',
    name: '京都站伊势丹',
    en: 'JR Kyoto Isetan',
    city: '京都',
    address: '京都府京都市下京区乌丸通盐小路下东盐小路町',
    hours: '10:00–20:00',
    tags: ['站内百货', '伴手礼', '美妆', '和果子'],
    desc: '如果你住在京都站附近，几乎可以把“最后一天补货”全部交给这里。和果子、抹茶、工艺礼盒都很好买。',
    nearby: ['京都站', 'The Cube', '京都塔'],
  },
  {
    id: 'nishiki_market',
    name: '锦市场',
    en: 'Nishiki Market',
    city: '京都',
    address: '京都府京都市中京区锦小路通寺町通至高仓通',
    hours: '多数店铺 10:00–18:00',
    tags: ['市场', '京都特产', '小吃', '工艺'],
    desc: '想把“京都味”买回去，锦市场就很有说服力。抹茶、腌菜、京果子和小工艺店都很适合边吃边挑。',
    nearby: ['锦天满宫', '寺町通', '四条乌丸'],
  },
  {
    id: 'tanukikoji',
    name: '札幌狸小路',
    en: 'Tanukikoji',
    city: '北海道',
    address: '北海道札幌市中央区南2条～南3条西1-7丁目',
    hours: '多数店铺 10:00–20:00',
    tags: ['北海道限定', '药妆', '零食', '拱廊'],
    desc: '北海道限定零食、药妆和保暖杂货都很集中，雨雪天也能舒服逛。很多人会把这里当札幌最稳的采购线。',
    nearby: ['薄野', '唐吉诃德', '大通公园'],
  },
  {
    id: 'sapporo_station',
    name: '大丸札幌 / Stellar Place',
    en: 'Daimaru Sapporo / Stellar Place',
    city: '北海道',
    address: '北海道札幌市中央区北5条西2丁目5',
    hours: '10:00–20:00 / 部分餐饮至 22:00',
    tags: ['站城综合', '伴手礼', '服饰', '美食'],
    desc: '如果时间不够，只围着札幌站周边逛也能买得很完整。北海道名产、服饰和连锁大店都非常集中。',
    nearby: ['JR Tower', '大丸札幌', '札幌站'],
  },
  {
    id: 'kokusai_dori',
    name: '国际通',
    en: 'Kokusai Dori',
    city: '冲绳',
    address: '冲绳县那霸市牧志1丁目～久茂地3丁目一带',
    hours: '多数店铺 11:00–21:00',
    tags: ['冲绳限定', '药妆', '手信', '夜逛'],
    desc: '冲绳土产、盐味零食、琉球玻璃和 T 恤最适合在这里一次带走。街道够热闹，晚上也很好逛。',
    nearby: ['平和通', '壶屋通', '县厅前站'],
  },
  {
    id: 'dfs_okinawa',
    name: 'DFS Okinawa',
    en: 'DFS Okinawa Naha City',
    city: '冲绳',
    address: '冲绳县那霸市Omoromachi 4-1',
    hours: '10:00–20:00',
    tags: ['免税', '大牌', '美妆', '箱包'],
    desc: '冲绳想买免税大牌和美妆，可以把时间留给 DFS。动线清楚、空调够足，购物体验很轻松。',
    nearby: ['歌町站', '那霸新都心', 'teamLab Future Park'],
  },
]

const TOP50_SET = new Set(TOP50_IDS)

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function formatJPY(price) {
  return `¥${Number(price).toLocaleString('en-US')}`
}

function formatCNY(price) {
  return `约合 ¥${Math.round(Number(price) * RMB_RATE)}`
}

function slugTitle(title) {
  const raw = String(title).replace(/[（）()]/g, ' ')
  if (raw.length <= 12) return [raw]
  const mid = Math.ceil(raw.length / 2)
  return [raw.slice(0, mid), raw.slice(mid)]
}

function inferCategory(item) {
  const existing = SHOPPING_CATEGORY_ORDER.includes(item.cat) ? item.cat : null
  const text = `${item.name} ${item.en || ''} ${item.jp || ''} ${item.tag || ''}`
  if (/精华|神仙水|美容液|肌底|Liposome|HAKU|Obagi|ELIXIR|Ultimune|SK-II|リポソーム|メラノ/i.test(text)) return '护肤精华'
  if (/面膜|洁面|洗颜|洗顔|洁颜|卸妆|洗面|酵素|泥膜|Cleansing|Washing Powder/i.test(text)) return '面膜清洁'
  if (/防晒|隔离|UV|Anessa|ALLIE|Biore|Primavista|Tone Up|Sun ?Cut|サンカット|Mermaid/i.test(text)) return '防晒隔离'
  if (/眼罩|护唇|牙刷|牙膏|足贴|蒸汽|口腔|唇膜|Lip Cream|MegRhythm|Systema|Toothpaste/i.test(text)) return '日用护理'
  if (/胃散|头痛|退热|整肠|眼药水|感冒|润喉|止痛|Biofermin|EVE|龙角散|Cabagin|Yunker|Sante|Lycee|Pabron|FX/i.test(text)) return '保健药品'
  if (/巧克力|饼干|生巧|白色恋人|KitKat|LeTAO|Meltykiss|Alfort|Campanella|Chocolate|Biscuit|Butter Sand|Cheese Factory|Yoku Moku/i.test(text)) return '饼干巧克力'
  if (/软糖|水果糖|糖果|Drops|Gummy|Hi-?Chew|CORORO|グミ|Milk Candy|喉糖/i.test(text)) return '糖果软糖'
  if (/拉面|泡面|乌冬|杯面|炒面|速食|Donbei|UFO|Noodles|Ramen|一兰|一風堂|マルタイ/i.test(text)) return '泡面速食'
  if (/清酒|抹茶|茶|威士忌|啤酒|酒|Matcha|Tea|Beer|Whisky|Dassai|Yamazaki|Ippodo|伊藤园|丸久|獺祭/i.test(text)) return '酒水茶饮'
  if (/电饭煲|烤面包机|热水壶|料理盘|电饭锅|Toaster|Kettle|Hot Plate|Sandwich Maker|Rice Cooker|BRUNO|Vitantonio|Tiger/i.test(text)) return '厨房家电'
  if (/吹风|吹風|直发|卷发|美容仪|剃须|按摩仪|Dryer|Shaver|Head Spa|Hair Iron|SALONIA|YA-MAN|松下纳米/i.test(text)) return '个护电器'
  if (/围巾|帽|帽子|内搭|连衣裙|内衣|Dress|Cap|Scarf|Heattech|Wacoal|SNIDEL|BEAMS|优衣库/i.test(text)) return '穿搭服饰'
  if (/鞋|靴|包|背包|手包|腰包|行李箱|Backpack|Luggage|Bag|Tanker|Onitsuka|Tiger|anello|ACE|Porter|Coach/i.test(text)) return '鞋履箱包'
  if (/钢笔|手账|笔|Notebook|Planner|Campus|Jetstream|Sarasa|Traveler|Hobonichi|文具|Pilot|百乐|MUJI Planner/i.test(text)) return '文具手账'
  if (/香水|香薰|香氛|线香|香囊|Diffuser|Perfume|Incense|Room Mist|Aroma|Blend|香り袋|SHIRO|THREE/i.test(text)) return '家居香氛'
  if (/铁瓶|切子|烧|锡杯|餐具|杯|盘|箸|筷|器|Mug|Plate|Cup|Glass|Tetsubin|Kiriko|有田|波佐见|九谷/i.test(text)) return '餐具工艺'
  if (/高达|手办|模型|ガンプラ|フィギュア|Nendoroid|Ichiban|扭蛋|Dragon Ball|Ultraman|One Piece|ガシャポン/i.test(text)) return '动漫手办'
  if (/Pokemon|皮卡丘|Hello Kitty|Sanrio|吉卜力|无脸男|Miffy|Snoopy|Kirby|周边|橡子共和国/i.test(text)) return 'IP 周边'
  if (/奶瓶|尿布|湿巾|辅食|宝宝|婴儿|Baby|Pigeon|Merries|Moony|Mama&Kids|和光堂/i.test(text)) return '母婴用品'
  if (/限定|伴手礼|Tokyo|Banana|Rusk|Perfect Cheese|礼盒|工厂/i.test(text)) return '伴手礼限定'
  return existing || '伴手礼限定'
}

function normalizeAudience(value) {
  if (Array.isArray(value) && value.length) return value
  return ['自用', '伴手礼']
}

function ensureBuy(cat, buy) {
  if (Array.isArray(buy) && buy.length) return buy
  return BUY_TEMPLATES[cat]
}

function ensureHighlights(item, cat) {
  if (Array.isArray(item.highlights) && item.highlights.length >= 3) return item.highlights.slice(0, 4)
  const audience = normalizeAudience(item.audience)
  const anchors = BUY_TEMPLATES[cat] || []
  return [
    item.short,
    `很多购物攻略都会把它归到「${item.tag}闭眼带」这类选手里。`,
    `${audience[0]} / ${audience[1] || '送礼'}都稳，放进行李箱也不容易踩雷。`,
    `${anchors[0]?.n || '热门商圈'}补货率更高，顺路扫货效率很高。`,
  ]
}

function ensureWhy(item, cat) {
  if (item.why) {
    if (TOP50_SET.has(item.id) && !/闭眼|送同事|送闺蜜|自用/.test(item.why)) {
      return `${item.why} 很多攻略都会把它放进「闭眼带」清单里，送礼和自留都很稳。`
    }
    return item.why
  }
  const audience = normalizeAudience(item.audience)
  return `${item.short}，属于 ${cat} 里讨论度一直很高的那类单品，很多人会把它当作「${audience[0]} / ${audience[1] || '送礼'}都不出错」的稳妥选择。`
}

function applyRename(item) {
  return renameMap[item.id] ? { ...item, ...renameMap[item.id] } : item
}

function assignImage(item, indexByCategory) {
  if (TOP50_SET.has(item.id)) {
    return { ...item, img: `top_${item.id}`, imgExt: 'svg' }
  }
  const pool = CATEGORY_PLACEHOLDERS[item.cat]
  const idx = indexByCategory[item.cat] ?? 0
  indexByCategory[item.cat] = idx + 1
  return { ...item, img: pool[idx % pool.length], imgExt: 'jpg' }
}

function normalizeNewSeed(seed) {
  const audience = normalizeAudience(seed.audience)
  const cat = seed.cat
  const base = {
    id: seed.id,
    cat,
    name: seed.name,
    en: seed.en,
    jp: seed.jp,
    tag: seed.tag,
    short: seed.short,
    jpy: formatJPY(seed.price),
    cny: formatCNY(seed.price),
    rating: seed.rating,
    audience,
    buy: ensureBuy(cat, seed.buy),
  }
  const withWhy = {
    ...base,
    why: seed.why || `${seed.short}，在很多日本购物攻略里都属于回购率很高的单品，适合 ${audience.join(' / ')}。`,
  }
  withWhy.highlights = seed.highlights || ensureHighlights(withWhy, cat)
  return TOP50_SET.has(seed.id)
    ? { ...withWhy, img: `top_${seed.id}`, imgExt: 'svg' }
    : { ...withWhy, img: CATEGORY_PLACEHOLDERS[cat][0], imgExt: 'jpg' }
}

function createPoster(item, rank) {
  const [bg, accent, soft] = CATEGORY_COLORS[item.cat]
  const lines = slugTitle(item.name)
  const subtitle = item.en || item.jp || item.tag
  const price = item.jpy.replace('（', ' · ').replace('）', '')
  const chip = `${item.cat} · TOP ${String(rank).padStart(2, '0')}`
  const starCount = item.rating || 5
  const stars = '★'.repeat(starCount) + '☆'.repeat(5 - starCount)
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="720" height="900" viewBox="0 0 720 900" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc">
  <title id="title">${escapeXml(item.name)}</title>
  <desc id="desc">${escapeXml(item.short)}</desc>
  <defs>
    <linearGradient id="bg-${item.id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${bg}" />
      <stop offset="100%" stop-color="${soft}" />
    </linearGradient>
  </defs>
  <rect width="720" height="900" rx="48" fill="url(#bg-${item.id})" />
  <circle cx="615" cy="120" r="120" fill="${accent}" opacity="0.12" />
  <circle cx="120" cy="775" r="160" fill="${accent}" opacity="0.10" />
  <rect x="48" y="48" width="624" height="804" rx="38" fill="white" opacity="0.74" />
  <text x="76" y="116" fill="${accent}" font-size="24" font-family="Arial, PingFang SC, Noto Sans SC, sans-serif" letter-spacing="3">JAPAN MUST BUY</text>
  <text x="76" y="194" fill="${accent}" font-size="92" font-weight="700" font-family="Georgia, Noto Serif SC, serif">${String(rank).padStart(2, '0')}</text>
  <rect x="76" y="232" width="268" height="42" rx="21" fill="${accent}" opacity="0.12" />
  <text x="94" y="260" fill="${accent}" font-size="22" font-family="Arial, PingFang SC, Noto Sans SC, sans-serif">${escapeXml(chip)}</text>
  <text x="76" y="356" fill="#1C1B19" font-size="28" font-family="Arial, PingFang SC, Noto Sans SC, sans-serif">${escapeXml(subtitle)}</text>
  <text x="76" y="454" fill="#1C1B19" font-size="54" font-weight="700" font-family="Georgia, Noto Serif SC, serif">${escapeXml(lines[0] || '')}</text>
  ${lines[1] ? `<text x="76" y="522" fill="#1C1B19" font-size="54" font-weight="700" font-family="Georgia, Noto Serif SC, serif">${escapeXml(lines[1])}</text>` : ''}
  <text x="76" y="610" fill="#4B5563" font-size="28" font-family="Arial, PingFang SC, Noto Sans SC, sans-serif">${escapeXml(item.short)}</text>
  <text x="76" y="690" fill="${accent}" font-size="34" font-weight="700" font-family="Arial, PingFang SC, Noto Sans SC, sans-serif">${escapeXml(price)}</text>
  <text x="76" y="738" fill="#6B7280" font-size="24" font-family="Arial, PingFang SC, Noto Sans SC, sans-serif">${escapeXml(item.cny)}</text>
  <text x="76" y="804" fill="${accent}" font-size="28" font-family="Arial, PingFang SC, Noto Sans SC, sans-serif">${stars}</text>
  <text x="494" y="804" fill="#6B7280" font-size="20" font-family="Arial, PingFang SC, Noto Sans SC, sans-serif">AIME SHOPPING GUIDE</text>
</svg>`
}

let legacySourcePath = indexTsPath
const tempLegacyPath = path.join(dataDir, '__legacy_index.ts')
try {
  const gitContent = execFileSync('git', ['show', 'HEAD:src/data/index.ts'], {
    cwd: rootDir,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  })
  await fs.writeFile(tempLegacyPath, gitContent, 'utf8')
  legacySourcePath = tempLegacyPath
} catch {
  try {
    await fs.access(shoppingDataPath)
    legacySourcePath = shoppingDataPath
  } catch {
    legacySourcePath = indexTsPath
  }
}

const legacyModuleUrl = pathToFileURL(legacySourcePath).href
const legacyModule = await import(legacyModuleUrl)
const legacySouvenirs = Array.isArray(legacyModule.SOUVENIRS) ? legacyModule.SOUVENIRS : []
if (legacySourcePath === tempLegacyPath) {
  await fs.unlink(tempLegacyPath).catch(() => {})
}

const transformedBase = []
const imageIndexByCategory = Object.create(null)
for (const legacy of legacySouvenirs) {
  const normalized = applyRename({ ...legacy, cat: inferCategory(legacy) })
  normalized.audience = normalizeAudience(normalized.audience)
  normalized.buy = ensureBuy(normalized.cat, normalized.buy)
  normalized.highlights = ensureHighlights(normalized, normalized.cat)
  normalized.why = ensureWhy(normalized, normalized.cat)
  transformedBase.push(assignImage(normalized, imageIndexByCategory))
}

const transformedExtras = extraSeeds.map((seed) => normalizeNewSeed(seed))
const souvenirsMap = new Map()
for (const item of [...transformedBase, ...transformedExtras]) {
  souvenirsMap.set(item.id, item)
}
const finalSouvenirs = Array.from(souvenirsMap.values())
  .sort((a, b) => SHOPPING_CATEGORY_ORDER.indexOf(a.cat) - SHOPPING_CATEGORY_ORDER.indexOf(b.cat) || a.name.localeCompare(b.name, 'zh-CN'))

const top50Items = TOP50_IDS.map((id) => souvenirsMap.get(id)).filter(Boolean)

await fs.mkdir(imagesDir, { recursive: true })
for (const [index, item] of top50Items.entries()) {
  const svg = createPoster(item, index + 1)
  await fs.writeFile(path.join(imagesDir, `sv_top_${item.id}.svg`), svg, 'utf8')
}

const shoppingDataContent = `import type { ShoppingCategoryMeta, ShoppingDistrict, Souvenir, SouvenirCategory } from './types'

export const SHOPPING_CATEGORY_ORDER: SouvenirCategory[] = ${JSON.stringify(SHOPPING_CATEGORY_ORDER, null, 2)}

export const SHOPPING_CATEGORY_META: Record<SouvenirCategory, ShoppingCategoryMeta> = ${JSON.stringify(SHOPPING_CATEGORY_META, null, 2)}

export const SHOPPING_TOP50_IDS: string[] = ${JSON.stringify(TOP50_IDS, null, 2)}

export const SHOPPING_DISTRICTS: ShoppingDistrict[] = ${JSON.stringify(SHOPPING_DISTRICTS, null, 2)}

export function buildAmapSearchUrl(query: string): string {
  return 'https://uri.amap.com/search?keyword=' + encodeURIComponent(query) + '&city=全国&callnative=0'
}

export function buildSouvenirImagePath(item: Pick<Souvenir, 'img' | 'imgExt'>): string {
  return '/images/sv_' + item.img + '.' + (item.imgExt || 'jpg')
}

export const SOUVENIRS: Souvenir[] = ${JSON.stringify(finalSouvenirs, null, 2)}
`

await fs.writeFile(shoppingDataPath, shoppingDataContent, 'utf8')

let indexContent = await fs.readFile(indexTsPath, 'utf8')
if (!indexContent.includes("import { SOUVENIRS } from './shoppingData'")) {
  indexContent = indexContent.replace(
    /} from '\.\/types'/,
    `} from './types'\nimport { SOUVENIRS } from './shoppingData'`,
  )
}
indexContent = indexContent.replace(
  /const SOUVENIRS: Souvenir\[] = \[[\s\S]*?const SEASON_DETAILS: Record<SeasonKey, SeasonDetail> = \{/,
  `const SEASON_DETAILS: Record<SeasonKey, SeasonDetail> = {`,
)
await fs.writeFile(indexTsPath, indexContent, 'utf8')

const counts = finalSouvenirs.reduce((acc, item) => {
  acc[item.cat] = (acc[item.cat] || 0) + 1
  return acc
}, {})

console.log('Generated shoppingData.ts')
console.log('Souvenirs:', finalSouvenirs.length)
console.log('Top50 posters:', top50Items.length)
console.log('Category counts:', counts)
