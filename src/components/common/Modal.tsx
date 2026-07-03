import { useEffect, useRef, type ReactNode } from 'react'
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

export interface ModalProps {
  id?: string
  open: boolean
  onClose: () => void
  children?: ReactNode
  maxWidth?: string
  innerClassName?: string
}

export default function Modal({
  id,
  open,
  onClose,
  children,
  maxWidth = 'md:max-w-3xl',
  innerClassName = '',
}: ModalProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useKeydown('Escape', onClose, open)

  useEffect(() => lockBody(open), [open])

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
  }, [open])

  return (
    <div
      id={id}
      className={`fixed inset-0 ${open ? 'show-modal' : 'hidden'}`}
      style={{ zIndex: 100 }}
    >
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={scrollRef}
        className={`relative h-full w-full flex items-start justify-center overflow-y-auto p-0 md:p-6`}
      >
        <div className={`modal-surface relative bg-paper w-full ${maxWidth} md:rounded-3xl shadow-2xl my-0 md:my-8 border hairline ${innerClassName}`} style={{ maxHeight: 'calc(100vh - 64px)', overflowY: 'auto' }}>
          {/* 关闭按钮 */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full glass grid place-items-center text-ink hover:bg-white transition"
            style={{ zIndex: 10, position: 'sticky', top: 16, marginLeft: 'auto', float: 'right' }}
            aria-label="关闭"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
          {children}
        </div>
      </div>
    </div>
  )
}
