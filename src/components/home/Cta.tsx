import { useNavigate } from 'react-router-dom'

export default function Cta() {
  const navigate = useNavigate()

  return (
    <section className="relative overflow-hidden" style={{ height: 460 }}>
      <img src="/images/cta_fuji.jpg" className="absolute inset-0 w-full h-full object-cover" alt="富士山" data-nozoom="1" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/50 to-ink/80" />
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <span className="eyebrow-light reveal show">Ready to Depart</span>
        <h2 className="text-white text-4xl md:text-6xl font-black serif mt-4 reveal show">收拾行囊 · 出发日本</h2>
        <div className="section-rule-light mt-6 mb-6 reveal show" />
        <p className="text-white/85 max-w-xl reveal show leading-8">把这份攻略收藏起来，让每一段旅程都从容而美好。</p>
        <button
          type="button"
          onClick={() => navigate('/?section=top')}
          className="mt-8 btn-primary font-bold px-9 py-4 rounded-full shadow-xl flex items-center gap-2 reveal show"
        >
          <span className="material-symbols-outlined">arrow_upward</span>
          回到顶部开始规划
        </button>
      </div>
    </section>
  )
}
