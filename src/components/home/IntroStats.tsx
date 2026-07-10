const cards = [
  {
    icon: '📍',
    value: '7',
    label: '七大区域',
    text: '覆盖本州、北海道与冲绳，从雪国到南国。',
  },
  {
    icon: '⛩',
    value: '40+',
    label: '精选景点',
    text: '真实数据整理，持续更新。',
    accentPlus: true,
  },
  {
    icon: '¥',
    value: '￥',
    label: '日元票价',
    text: '门票 · 交通 · 时长一览。',
  },
  {
    icon: '🎬',
    value: '4K',
    label: '实拍影像',
    text: '国内可访问的实拍视频。',
  },
]

export interface IntroStatsProps {
  onOpenIntro: (index: number) => void
}

export default function IntroStats({ onOpenIntro }: IntroStatsProps) {
  return (
    <section id="intro" className="relative bg-paper py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid lg:grid-cols-12 gap-14 items-start">
          <div className="lg:col-span-6 reveal show">
            <div className="flex items-center gap-3 mb-6">
              <span className="section-num">— 01</span>
              <span className="eyebrow">日本旅行入门</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black serif leading-tight mb-8">
              一场跨越千年与未来的<span className="text-pine">旅行</span>
            </h2>
            <div className="section-rule mb-8" />
            <p className="text-ink/75 leading-loose text-[15.5px]">
              日本是一个能同时满足所有旅行想象的国度：清晨你可以在京都的千本鸟居下听风穿林，午后在大阪道顿堀被霓虹与美食包围，夜晚又在东京涩谷感受都市脉搏。春有樱、夏有祭、秋有枫、冬有雪——无论何时到访，都能遇见不一样的日本。
            </p>
            <p className="text-ink/70 leading-loose text-[15px] mt-5">
              本攻略基于 2025–2026 年最新信息整理，涵盖景点门票、开放时间、交通方式与实用贴士，助你轻松规划一段难忘的旅程。
            </p>
          </div>
          <div className="lg:col-span-6 grid grid-cols-2 gap-5 reveal show">
            {cards.map((card, index) => (
              <button
                key={card.label}
                type="button"
                onClick={() => onOpenIntro(index)}
                className="bg-card rounded-2xl p-7 border hairline hover:-translate-y-1 transition-transform cursor-pointer text-left"
              >
                <div className="text-pine mb-3">
                  <span className="text-3xl leading-none">{card.icon}</span>
                </div>
                <div className="text-5xl font-black serif text-ink">
                  {card.accentPlus ? (
                    <>
                      40<span className="text-2xl text-terracotta">+</span>
                    </>
                  ) : (
                    card.value
                  )}
                </div>
                <p className="text-[13px] text-muted mt-2 tracking-wide">{card.label}</p>
                <p className="text-[13px] text-ink/60 mt-2 leading-6">{card.text}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
