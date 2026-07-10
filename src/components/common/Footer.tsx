import { Link } from 'react-router-dom'

const quickLinks = [
  { id: 'seasons', label: '最佳季节' },
  { id: 'destinations', label: '目的地指南' },
  { id: 'food', label: '美食推荐' },
  { id: 'videos', label: '旅行影像' },
  { id: 'events', label: '节日祭典' },
  { id: 'tools', label: '旅行工具' },
  { id: 'practical', label: '实用信息' },
  { id: 'foreign', label: '安心出行' },
]

export default function Footer({ compact = false }) {
  return (
    <footer className="bg-ink text-sand/75">
      <div className={`max-w-7xl mx-auto px-6 md:px-10 ${compact ? 'py-12' : 'py-16'}`}>
        <div className={`${compact ? 'flex flex-col md:flex-row md:items-center md:justify-between gap-8' : 'grid md:grid-cols-4 gap-12'}`}>
          <div className={compact ? '' : 'md:col-span-2'}>
            <div className="flex items-center gap-3 mb-5">
              <span className="w-9 h-9 rounded-full bg-terracotta text-white grid place-items-center serif font-bold text-lg">日</span>
              <div>
                <div className="serif font-bold text-lg text-sand">日本旅游全攻略</div>
                <div className="text-[10px] tracking-[.3em] uppercase text-sand/50 mt-0.5">
                  {compact ? '我的旅行心愿单' : '日本旅行编辑整理 · 2026'}
                </div>
              </div>
            </div>
            <p className="text-[14px] leading-8 max-w-md text-sand/70">
              {compact
                ? '你的旅行心愿单仅保存在当前浏览器本地，与旧版 localStorage.japan_favorites_v1 完全兼容，不会上传服务器。'
                : '一份为中国旅行者打造的日本旅游指南，涵盖七大目的地、40+ 景点、美食影像与 2026 最新实用信息。愿你的旅程尽兴而归。'}
            </p>
          </div>

          {compact ? (
            <div className="flex flex-wrap gap-4 text-[14px]">
              <Link to="/?section=destinations" className="hover:text-terracotta transition">目的地</Link>
              <Link to="/?section=food" className="hover:text-terracotta transition">美食</Link>
              <Link to="/?section=events" className="hover:text-terracotta transition">节日祭典</Link>
              <Link to="/shopping" className="hover:text-terracotta transition">购物指南</Link>
              <Link to="/?section=top" className="hover:text-terracotta transition">返回主页</Link>
            </div>
          ) : (
            <>
              <div>
                <p className="text-sand font-semibold mb-4 tracking-wider text-[13px] uppercase">快速导航</p>
                <ul className="space-y-2.5 text-[14px]">
                  {quickLinks.map((item) => (
                    <li key={item.id}>
                      <Link to={`/?section=${item.id}`} className="hover:text-terracotta transition">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link to="/shopping" className="hover:text-terracotta transition">
                      购物指南
                    </Link>
                  </li>
                  <li>
                    <Link to="/favorites" className="hover:text-terracotta transition">
                      我的收藏
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <p className="text-sand font-semibold mb-4 tracking-wider text-[13px] uppercase">信息来源</p>
                <ul className="space-y-2.5 text-[14px]">
                  <li>日本国家旅游局 (JNTO)</li>
                  <li>各景点官方网站</li>
                  <li>公开旅行资讯（2025–2026）</li>
                </ul>
              </div>
            </>
          )}
        </div>
        <div className="border-t border-sand/10 mt-12 pt-6 text-[12px] text-sand/50 flex flex-col md:flex-row justify-between gap-2">
          <p>© 2026 日本旅游全攻略 · 内容仅供旅行参考，出行前请以官方最新信息为准。</p>
          <p>图片与视频版权归原作者所有</p>
        </div>
      </div>
    </footer>
  )
}
