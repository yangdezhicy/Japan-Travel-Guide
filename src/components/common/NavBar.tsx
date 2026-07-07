import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import useScrollSpy from '../../hooks/useScrollSpy'

/** 首页锚点 —— 顺序需与 DOM 顺序一致（scroll-spy 依赖顺序选择激活项） */
const sectionLinks = [
  { id: 'seasons', label: '最佳季节' },
  { id: 'destinations', label: '目的地' },
  { id: 'food', label: '美食' },
  { id: 'videos', label: '旅行影像' },
  { id: 'events', label: '节日祭典' },
  { id: 'tools', label: '旅行工具' },
  { id: 'practical', label: '实用信息' },
  { id: 'foreign', label: '安心出行' },
]

/** 用于 IntersectionObserver 的所有可能 section id（包含 top） */
const HOME_SECTION_IDS = ['top', ...sectionLinks.map((item) => item.id)]

export default function NavBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (open) {
      document.body.classList.add('modal-open')
    } else {
      document.body.classList.remove('modal-open')
    }
    return () => document.body.classList.remove('modal-open')
  }, [open])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname, location.search])

  const isHome = location.pathname === '/'
  const isFavorites = location.pathname === '/favorites'
  const isShopping = location.pathname === '/shopping'

  /**
   * scroll-spy：仅在首页启用；其他路由传空数组，hook 内部会置为 null。
   * rootMargin: "-30% 0px -60% 0px" —— 顶部 30% 视口以内的 section 视为激活。
   */
  const spyIds = useMemo(() => (isHome ? HOME_SECTION_IDS : []), [isHome])
  const activeSection = useScrollSpy(spyIds)

  const mobileIcon = open ? 'close' : 'menu'

  const navClassName = useMemo(() => {
    return `fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled || open ? 'shadow-md' : ''}`
  }, [scrolled, open])

  const goSection = (sectionId: string) => {
    setOpen(false)
    if (isHome) {
      // 已经在首页：不刷 URL，直接 scroll
      if (sectionId === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        const target = document.getElementById(sectionId)
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      return
    }
    navigate(`/?section=${sectionId}`)
  }

  const linkActiveClass = 'text-terracotta font-bold'
  const linkIdleClass = ''

  return (
    <header id="nav" className={navClassName}>
      <nav className="glass border-b hairline">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button type="button" onClick={() => goSection('top')} className="flex items-center gap-3 group text-left">
            <span className="w-9 h-9 rounded-full bg-pine text-white grid place-items-center serif font-bold text-lg shadow-sm group-hover:rotate-6 transition-transform">
              日
            </span>
            <div className="leading-tight">
              <div className="serif font-bold text-[15px] tracking-wide text-ink">日本旅游全攻略</div>
              <div className="text-[10px] tracking-[.28em] uppercase text-muted mt-0.5">Japan · 2026</div>
            </div>
          </button>

          <div className="hidden lg:flex items-center gap-8 text-ink/75 font-medium">
            {sectionLinks.map((link) => {
              const active = isHome && activeSection === link.id
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => goSection(link.id)}
                  className={`nav-link ${active ? linkActiveClass : linkIdleClass}`}
                >
                  {link.label}
                </button>
              )
            })}
            <Link to="/shopping" className={`nav-link ${isShopping ? linkActiveClass : ''}`}>
              购物指南
            </Link>
            <Link to="/favorites" className={`nav-link ${isFavorites ? linkActiveClass : ''}`}>
              我的收藏
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => goSection('destinations')}
              className="hidden sm:inline-flex btn-primary text-[13px] font-semibold px-5 py-2.5 rounded-full items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">explore</span>
              开始规划
            </button>
            <button
              id="menu-btn"
              type="button"
              aria-label="菜单"
              className="lg:hidden w-10 h-10 grid place-items-center rounded-full text-ink hover:bg-black/5 transition"
              onClick={() => setOpen((value) => !value)}
            >
              <span id="menu-icon" className="material-symbols-outlined">
                {mobileIcon}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        <div
          className={`lg:hidden fixed inset-0 bg-ink/45 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          style={{ top: 64 }}
          onClick={() => setOpen(false)}
        />

        <aside
          id="mobile-menu"
          className={`lg:hidden fixed right-0 w-[min(88vw,360px)] bg-paper shadow-2xl border-l hairline transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full pointer-events-none'}`}
          style={{ top: 64, height: 'calc(100dvh - 64px)' }}
          aria-hidden={!open}
        >
          <div className="h-full overflow-y-auto px-5 py-5 scrollbar-hide">
            <div className="rounded-3xl bg-ink text-white p-5 mb-4">
              <p className="text-[11px] tracking-[.22em] uppercase text-white/50">Quick Navigation</p>
              <p className="serif text-xl font-black mt-1">选择你想看的攻略</p>
              <p className="text-white/62 text-[12.5px] leading-6 mt-2">景点、美食、工具、购物和收藏都可以快速跳转。</p>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {sectionLinks.map((link) => {
                const active = isHome && activeSection === link.id
                return (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => goSection(link.id)}
                    className={`min-h-[52px] rounded-2xl px-3 text-left font-semibold border transition ${
                      active ? 'bg-pine text-white border-pine shadow-md' : 'bg-card text-ink/78 border-black/8 active:scale-[.98]'
                    }`}
                  >
                    <span className="block text-[13px]">{link.label}</span>
                    {active ? <span className="mt-1 block w-6 h-0.5 rounded-full bg-terracotta" /> : null}
                  </button>
                )
              })}
            </div>
            <div className="mt-4 space-y-2.5">
              <Link
                to="/shopping"
                className={`min-h-[56px] rounded-2xl px-4 flex items-center justify-between border font-bold ${isShopping ? 'bg-terracotta text-white border-terracotta' : 'bg-card text-ink/80 border-black/8'}`}
              >
                <span className="flex items-center gap-2"><span className="material-symbols-outlined">shopping_bag</span>购物指南</span>
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </Link>
              <Link
                to="/favorites"
                className={`min-h-[56px] rounded-2xl px-4 flex items-center justify-between border font-bold ${isFavorites ? 'bg-terracotta text-white border-terracotta' : 'bg-card text-ink/80 border-black/8'}`}
              >
                <span className="flex items-center gap-2"><span className="material-symbols-outlined">favorite</span>我的收藏</span>
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </Link>
            </div>
          </div>
        </aside>
      </nav>
    </header>
  )
}
