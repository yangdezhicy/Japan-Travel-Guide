import type { ReactNode } from 'react'

export interface SectionHeaderProps {
  index: string | number
  eyebrow: string
  title: string
  desc?: ReactNode
  className?: string
  maxWidth?: string
}

export default function SectionHeader({
  index,
  eyebrow,
  title,
  desc,
  className = '',
  maxWidth = 'max-w-3xl',
}: SectionHeaderProps) {
  return (
    <div className={`${maxWidth} ${className}`}>
      <div className="flex items-center gap-3 mb-5">
        <span className="section-num">— {index}</span>
        <span className="eyebrow">{eyebrow}</span>
      </div>
      <h2 className="text-4xl md:text-5xl font-black serif leading-tight">{title}</h2>
      <div className="section-rule mt-6 mb-5" />
      {desc ? <p className="text-ink/65 leading-8 text-[15px]">{desc}</p> : null}
    </div>
  )
}
