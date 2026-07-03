import type { ReactNode } from 'react'
import type { FavType } from '../../data/types'
import FavBtn from '../common/FavBtn'
import ZoomImg from '../common/ZoomImg'

export interface FavCardProps {
  type: FavType
  id: string
  title: string
  subtitle?: string
  description?: ReactNode
  imageSrc?: string
  tag?: string
  meta?: ReactNode
  price?: string
  onOpen: () => void
  variant?: 'image' | 'text'
}

export default function FavCard({
  type,
  id,
  title,
  subtitle,
  description,
  imageSrc,
  tag,
  meta,
  price,
  onOpen,
  variant = 'image',
}: FavCardProps) {
  if (variant === 'text') {
    return (
      <article
        className="relative bg-card rounded-2xl border hairline p-6 hover:border-pine/40 hover:-translate-y-1 transition-all cursor-pointer flex flex-col"
        onClick={onOpen}
      >
        <FavBtn type={type} id={id} />
        <div className="flex items-center justify-between mb-3">
          <span className="serif text-terracotta font-semibold text-sm">— 收藏</span>
          {tag ? <span className="tag-pill">{tag}</span> : null}
        </div>
        <h4 className="serif font-bold text-lg text-ink leading-snug mb-2 pr-10">{title}</h4>
        {subtitle ? <p className="text-muted tracking-[.2em] uppercase text-[11px] mb-2">{subtitle}</p> : null}
        {description ? <p className="text-ink/65 text-[13.5px] leading-7">{description}</p> : null}
        <div className="mt-auto pt-5 flex items-center justify-between gap-3 border-t hairline">
          <div className="text-[12px] text-ink/55">{meta}</div>
          <span className="inline-flex items-center gap-1 text-pine font-semibold text-[12.5px]">
            查看详情
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </span>
        </div>
      </article>
    )
  }

  return (
    <article
      className="relative spot-card group bg-card rounded-2xl overflow-hidden border hairline flex flex-col cursor-pointer"
      onClick={onOpen}
    >
      <div className="relative overflow-hidden" style={{ height: 176 }}>
        <ZoomImg src={imageSrc || ''} alt={title} className="card-img w-full h-full object-cover" />
        {tag ? <span className="absolute top-3 left-3 tag-pill">{tag}</span> : null}
        <FavBtn type={type} id={id} />
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h4 className="serif font-bold text-lg leading-snug">{title}</h4>
        {subtitle ? <p className="text-muted tracking-[.2em] uppercase mt-1 text-[12px]">{subtitle}</p> : null}
        {description ? <p className="text-ink/60 leading-6 mt-2 text-[13px] line-clamp-2">{description}</p> : null}
        <div className="mt-auto pt-4 border-t hairline flex items-end justify-between gap-3">
          <div>
            {price ? <p className="serif font-bold text-terracotta text-[15px]">{price}</p> : null}
            {meta ? <p className="text-[12px] text-ink/55 mt-1">{meta}</p> : null}
          </div>
          <span className="inline-flex items-center gap-1 text-pine font-semibold text-[12.5px]">
            查看详情
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </span>
        </div>
      </div>
    </article>
  )
}
