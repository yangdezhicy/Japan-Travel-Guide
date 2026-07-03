import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react'
import { useFavorites } from '../../hooks/useFavorites'
import type { FavType } from '../../data/types'

interface BurstPreset {
  fx: string
  fy: string
  fr: string
}

interface Burst extends BurstPreset {
  key: string
}

interface Ripple {
  key: string
}

const BURST_PRESETS: BurstPreset[] = [
  { fx: '-24px', fy: '-70px', fr: '-15deg' },
  { fx: '0px', fy: '-82px', fr: '0deg' },
  { fx: '24px', fy: '-72px', fr: '15deg' },
]

function createBursts(): Burst[] {
  return BURST_PRESETS.map((item, index) => ({ ...item, key: `${Date.now()}-${index}` }))
}

export interface FavBtnProps {
  type: FavType
  id: string
  pos?: 'card' | 'modal'
  tone?: 'default' | 'inverse'
}

type FavBurstStyle = CSSProperties & {
  '--fx'?: string
  '--fy'?: string
  '--fr'?: string
}

export default function FavBtn({ type, id, pos = 'card', tone = 'default' }: FavBtnProps) {
  const { isFav, toggleFav } = useFavorites()
  const [phase, setPhase] = useState<string>('')
  const [bursts, setBursts] = useState<Burst[]>([])
  const [ripples, setRipples] = useState<Ripple[]>([])
  const timersRef = useRef<number[]>([])

  const favored = isFav(type, id)
  const place = pos === 'modal' ? 'top-4 left-4' : 'top-3 right-3'
  const toneClass = tone === 'inverse' ? 'text-white/85 hover:text-white' : 'text-ink/60 hover:text-terracotta'

  const clearTimers = () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer))
    timersRef.current = []
  }

  useEffect(() => clearTimers, [])

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    clearTimers()

    const added = toggleFav(type, id)
    setPhase(added ? 'fav-pop-on' : 'fav-pop-off')

    if (added) {
      setBursts(createBursts())
      setRipples([])
      timersRef.current.push(window.setTimeout(() => setBursts([]), 900))
    } else {
      const rippleKey = `${Date.now()}-ripple`
      setRipples([{ key: rippleKey }])
      setBursts([])
      timersRef.current.push(window.setTimeout(() => setRipples([]), 560))
    }

    if (window.navigator && typeof window.navigator.vibrate === 'function') {
      try {
        window.navigator.vibrate(added ? 20 : [10, 30, 10])
      } catch {
        // noop
      }
    }

    timersRef.current.push(window.setTimeout(() => setPhase(''), 520))
  }

  return (
    <button
      type="button"
      aria-label={favored ? '取消收藏' : '加入收藏'}
      aria-pressed={favored}
      onClick={handleClick}
      className={`fav-btn absolute ${place} w-10 h-10 rounded-full glass grid place-items-center hover:bg-white transition ${toneClass} ${phase}`}
      style={{ position: 'absolute' }}
    >
      {bursts.map((burst) => (
        <span
          key={burst.key}
          className="fav-fly material-symbols-outlined"
          style={{ '--fx': burst.fx, '--fy': burst.fy, '--fr': burst.fr } as FavBurstStyle}
        >
          favorite
        </span>
      ))}
      {ripples.map((ripple) => (
        <span key={ripple.key} className="fav-ripple-el" />
      ))}
      <span className={`material-symbols-outlined fav-icon ${favored ? 'fav-on' : 'fav-off'}`}>
        favorite
      </span>
    </button>
  )
}
