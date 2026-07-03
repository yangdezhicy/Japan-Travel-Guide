import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export interface LightboxState {
  open: boolean
  src: string
  alt: string
}

export interface LightboxContextValue {
  lightbox: LightboxState
  openLightbox: (src: string, alt?: string) => void
  closeLightbox: () => void
}

const LightboxContext = createContext<LightboxContextValue | null>(null)

interface LightboxProviderProps {
  children: ReactNode
}

export function LightboxProvider({ children }: LightboxProviderProps) {
  const [lightbox, setLightbox] = useState<LightboxState>({ open: false, src: '', alt: '' })

  const openLightbox = useCallback((src: string, alt: string = '') => {
    setLightbox({ open: true, src, alt })
  }, [])

  const closeLightbox = useCallback(() => {
    setLightbox((current) => ({ ...current, open: false }))
  }, [])

  const value = useMemo<LightboxContextValue>(
    () => ({
      lightbox,
      openLightbox,
      closeLightbox,
    }),
    [closeLightbox, lightbox, openLightbox],
  )

  return createElement(LightboxContext.Provider, { value }, children)
}

export function useLightbox(): LightboxContextValue {
  const context = useContext(LightboxContext)
  if (!context) {
    throw new Error('useLightbox 必须在 LightboxProvider 内使用')
  }
  return context
}
