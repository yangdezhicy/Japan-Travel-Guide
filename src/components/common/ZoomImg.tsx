import type { ImgHTMLAttributes, MouseEvent } from 'react'
import { useLightbox } from '../../hooks/useLightbox'

export interface ZoomImgProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  src: string
  alt?: string
  disabled?: boolean
}

export default function ZoomImg({
  src,
  alt = '',
  className = '',
  onClick,
  disabled = false,
  loading = 'lazy',
  ...rest
}: ZoomImgProps) {
  const { openLightbox } = useLightbox()

  const handleClick = (event: MouseEvent<HTMLImageElement>) => {
    if (disabled) {
      onClick?.(event)
      return
    }

    event.stopPropagation()
    openLightbox(src, alt)
    onClick?.(event)
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onClick={handleClick}
      loading={loading}
      style={{ cursor: disabled ? 'default' : 'zoom-in' }}
      {...rest}
    />
  )
}
