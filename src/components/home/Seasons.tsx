import type { SeasonKey } from '../../data/types'

interface SeasonCard {
  key: SeasonKey
  icon: string
  iconClass: string
  label: string
  title: string
  time: string
  desc: string
}

const seasonCards: SeasonCard[] = [
  {
    key: 'spring',
    icon: 'local_florist',
    iconClass: 'text-terracotta',
    label: 'Spring',
    title: '春 · 樱花季',
    time: '3 月下旬 – 4 月上旬',
    desc: '樱花自南向北绽放，东京、京都、大阪约在 3 月底至 4 月初进入满开。赏樱名所人气极高，建议提前预订住宿。',
  },
  {
    key: 'summer',
    icon: 'festival',
    iconClass: 'text-pine',
    label: 'Summer',
    title: '夏 · 花火祭典',
    time: '7 月 – 8 月',
    desc: '全国各地花火大会与夏日祭典轮番登场，北海道富良野薰衣草 7 月下旬盛开，是避暑与赏花的绝佳去处。',
  },
  {
    key: 'autumn',
    icon: 'park',
    iconClass: 'text-terracotta',
    label: 'Autumn',
    title: '秋 · 红叶狩',
    time: '11 月中旬 – 12 月上旬',
    desc: '枫叶自北向南染红山野，京都清水寺、岚山一带层林尽染，夜间点灯更添诗意，是摄影爱好者的最爱。',
  },
  {
    key: 'winter',
    icon: 'ac_unit',
    iconClass: 'text-pine',
    label: 'Winter',
    title: '冬 · 雪国温泉',
    time: '12 月 – 2 月',
    desc: '北海道粉雪松软，是滑雪胜地；箱根、草津等地温泉热气蒸腾，泡汤赏雪是冬日日本的极致享受。',
  },
]

export interface SeasonsProps {
  onOpenSeason: (key: SeasonKey) => void
}

export default function Seasons({ onOpenSeason }: SeasonsProps) {
  return (
    <section id="seasons" className="relative py-24 bg-card">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="max-w-3xl mb-14 reveal show">
          <div className="flex items-center gap-3 mb-5">
            <span className="section-num">— 02</span>
            <span className="eyebrow">Best Seasons</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black serif leading-tight">何时出发 · 四季物语</h2>
          <div className="section-rule mt-6 mb-5" />
          <p className="text-ink/65 leading-8 text-[15px]">
            日本四季分明，每个季节都有专属的浪漫。选对时间，让旅程更加值得。
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {seasonCards.map((card, index) => (
            <div
              key={card.key}
              className="reveal show group bg-paper rounded-2xl p-8 border hairline hover:border-pine/40 hover:-translate-y-1 transition-all flex flex-col"
              style={{ transitionDelay: `${index * 0.05}s` }}
            >
              <div className="w-12 h-12 rounded-full bg-white grid place-items-center mb-6 border hairline">
                <span className={`material-symbols-outlined text-2xl ${card.iconClass}`}>{card.icon}</span>
              </div>
              <p className="text-[11px] tracking-[.28em] uppercase text-muted mb-2">{card.label}</p>
              <h3 className="text-2xl font-bold serif mb-2">{card.title}</h3>
              <p className="text-pine text-[13px] font-semibold mb-4 tracking-wider">{card.time}</p>
              <p className="text-ink/70 text-[14px] leading-7">{card.desc}</p>
              <div className="mt-auto pt-6">
                <button
                  type="button"
                  onClick={() => onOpenSeason(card.key)}
                  className="inline-flex btn-primary px-5 py-2.5 rounded-full items-center justify-center gap-2 text-[12.5px] font-semibold"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  查看详情
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
