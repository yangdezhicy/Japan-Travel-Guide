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
    return `fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-md' : ''}`
  }, [scrolled])

  const goSection = (sectionId: string) => {
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

        <div id="mobile-menu" className={`lg:hidden border-t hairline bg-paper/95 backdrop-blur ${open ? '' : 'hidden'}`}>
          <div className="px-6 py-2 flex flex-col">
            {sectionLinks.map((link) => {
              const active = isHome && activeSection === link.id
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => goSection(link.id)}
                  className={`mobile-link py-3 text-left font-medium border-b hairline ${
                    active ? linkActiveClass : 'text-ink/80'
                  }`}
                >
                  {link.label}
                </button>
              )
            })}
            <Link
              to="/shopping"
              className={`mobile-link py-3 border-b hairline ${isShopping ? linkActiveClass : 'text-ink/80 font-medium'}`}
            >
              购物指南
            </Link>
            <Link
              to="/favorites"
              className={`mobile-link py-3 ${isFavorites ? linkActiveClass : 'text-ink/80 font-medium'}`}
            >
              我的收藏
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}
