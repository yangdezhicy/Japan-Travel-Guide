import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HERO_SLIDES } from '../../data/index'

const HERO_IMAGES = [
  'carousel_fuji.jpg',
  'carousel_kyoto.jpg',
  'carousel_tokyo.jpg',
  'carousel_hokkaido.jpg',
  'carousel_okinawa.jpg',
  'carousel_osaka.jpg',
]

export default function Hero() {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return undefined
    const timer = window.setInterval(() => {
      setCurrent((value) => (value + 1) % HERO_SLIDES.length)
    }, 6000)
    return () => window.clearInterval(timer)
  }, [paused])

  const slide = HERO_SLIDES[current]
  const goSection = (sectionId: string) => navigate(`/?section=${sectionId}`)

  const counter = useMemo(() => String(current + 1).padStart(2, '0'), [current])

  return (
    <section
      id="top"
      className="relative h-screen w-full overflow-hidden"
      style={{ minHeight: 680 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div id="hero-slides" className="absolute inset-0">
        {HERO_IMAGES.map((image, index) => (
          <div key={image} className={`hero-slide ${index === current ? 'active' : ''}`}>
            <img src={`/images/${image}`} alt={HERO_SLIDES[index].eyebrow} data-nozoom="1" />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/80" />
      </div>

      <div className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 items-center gap-3 z-10">
        <div className="seal text-white/95 text-xl border border-white/40 px-3 py-6 rounded-sm">四 季 日 本</div>
      </div>

      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 md:px-10 flex flex-col justify-center">
        <div className="flex items-center gap-3">
          <span className="rule-light" />
          <span className="eyebrow-light hero-text-anim">{slide.eyebrow}</span>
        </div>
        <h1
          className="mt-6 text-white font-black serif leading-[1.05] text-5xl md:text-7xl lg:text-8xl max-w-4xl hero-text-anim"
          dangerouslySetInnerHTML={{ __html: slide.title }}
        />
        <div className="mt-7 flex items-center gap-3">
          <span className="rule-light" />
          <span className="text-white/85 tracking-[.28em] uppercase text-[11px] font-semibold hero-text-anim">
            {slide.tag}
          </span>
        </div>
        <p className="mt-6 max-w-2xl text-white/85 text-[15px] md:text-lg leading-loose hero-text-anim">
          {slide.sub}
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <button
            type="button"
            onClick={() => goSection('destinations')}
            className="btn-primary font-semibold px-8 py-4 rounded-full flex items-center gap-2 shadow-lg"
          >
            <span className="material-symbols-outlined text-[20px]">map</span>
            探索目的地
          </button>
          <button
            type="button"
            onClick={() => navigate('/shopping')}
            className="btn-outline font-semibold px-8 py-4 rounded-full flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">redeem</span>
            购物指南
          </button>
        </div>
      </div>

      <button
        type="button"
        aria-label="上一张"
        className="hero-arrow absolute left-5 md:left-8 top-1/2 -translate-y-1/2 z-20"
        onClick={() => setCurrent((value) => (value - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
      >
        <span className="material-symbols-outlined">chevron_left</span>
      </button>
      <button
        type="button"
        aria-label="下一张"
        className="hero-arrow absolute right-5 md:right-8 top-1/2 -translate-y-1/2 z-20"
        onClick={() => setCurrent((value) => (value + 1) % HERO_SLIDES.length)}
      >
        <span className="material-symbols-outlined">chevron_right</span>
      </button>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
        {HERO_SLIDES.map((item, index) => (
          <button
            key={item.eyebrow}
            type="button"
            className={`hero-dot ${index === current ? 'active' : ''}`}
            onClick={() => setCurrent(index)}
            aria-label={`查看第 ${index + 1} 张`}
          />
        ))}
      </div>

      <div className="hidden md:block absolute bottom-9 right-10 z-20 text-white/80 serif text-sm tracking-widest">
        <span>{counter}</span> <span className="text-white/40">/ 06</span>
      </div>
    </section>
  )
}
