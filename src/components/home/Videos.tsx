import { buildBilibiliPlayerUrl, REGIONS, VIDEO_BY_REGION } from '../../data/index'
import type { RegionId } from '../../data/types'

export interface VideosProps {
  activeRegionId: RegionId
}

export default function Videos({ activeRegionId }: VideosProps) {
  const region = REGIONS.find((item) => item.id === activeRegionId) || REGIONS[0]
  const videos = VIDEO_BY_REGION[region.id] || []

  return (
    <section id="videos" className="relative py-24 bg-paper">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="max-w-3xl mb-12 reveal show">
          <div className="flex items-center gap-3 mb-5">
            <span className="section-num">— 05</span>
            <span className="eyebrow">旅行影像</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black serif leading-tight">{region.name} · 旅行影像</h2>
          <div className="section-rule mt-6 mb-5" />
          <p className="text-ink/65 leading-8 text-[15px]">
            以下影像来自哔哩哔哩（国内可直接访问），跟随镜头提前感受日本的四季风光。若某个视频无法加载，可能因原作者已调整分享设置。
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-7 reveal show">
          {videos.map((video, index) => (
            <div key={video.bv} className="bg-card rounded-2xl overflow-hidden border hairline hover:shadow-lg transition-shadow">
              <div className="bg-black video-frame">
                <iframe
                  className="w-full h-full"
                  src={buildBilibiliPlayerUrl(video.bv)}
                  scrolling="no"
                  frameBorder="0"
                  allowFullScreen
                  loading="lazy"
                  title={video.title}
                />
              </div>
              <div className="p-5 flex items-start gap-3">
                <span className="serif text-terracotta font-semibold text-sm mt-0.5">— {String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h4 className="serif font-bold text-[16px] text-ink leading-snug">{video.title}</h4>
                  <p className="text-[12px] text-muted mt-1 tracking-wider">Bilibili · {video.bv}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-[12px] text-muted mt-8 tracking-wider">影像版权归原作者所有，此处以官方播放器嵌入，仅作旅行参考。</p>
      </div>
    </section>
  )
}
