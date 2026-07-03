import { useEffect } from 'react'
import { useLightbox } from '../../hooks/useLightbox'
import useKeydown from '../../hooks/useKeydown'

function lockBody(open: boolean): () => void {
  if (!open) return () => {}

  window.__jpModalLocks = (window.__jpModalLocks || 0) + 1
  document.body.classList.add('modal-open')

  return () => {
    window.__jpModalLocks = Math.max((window.__jpModalLocks || 1) - 1, 0)
    if (!window.__jpModalLocks) {
      document.body.classList.remove('modal-open')
    }
  }
}

export default function Lightbox() {
  const { lightbox, closeLightbox } = useLightbox()

  useKeydown('Escape', closeLightbox, lightbox.open)
  useEffect(() => lockBody(lightbox.open), [lightbox.open])

  return (
    <div
      id="img-lightbox"
      className={`fixed inset-0 ${lightbox.open ? 'show-modal' : 'hidden'}`}
      style={{ zIndex: 200 }}
      data-lightbox-open={lightbox.open ? 'true' : 'false'}
    >
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={closeLightbox} />
      <button
        type="button"
        onClick={closeLightbox}
        className="fixed top-4 right-4 w-11 h-11 rounded-full glass grid place-items-center text-white hover:bg-white/20 transition"
        style={{ zIndex: 210 }}
        aria-label="关闭图片预览"
      >
        <span className="material-symbols-outlined">close</span>
      </button>
      <div className="relative h-full w-full flex items-center justify-center p-4 md:p-10">
        <img
          id="lightbox-img"
          src={lightbox.src}
          alt={lightbox.alt}
          className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
        />
      </div>
    </div>
  )
}
