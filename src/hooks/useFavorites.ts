import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { FAVORITES_STORAGE_KEY, getFavoriteCounts } from '../data/index'
import type { FavType, FavoriteCounts, FavoritesState } from '../data/types'

export interface FavoritesContextValue {
  favorites: FavoritesState
  counts: FavoriteCounts
  isFav: (type: FavType, id: string) => boolean
  toggleFav: (type: FavType, id: string) => boolean
  setFavorites: React.Dispatch<React.SetStateAction<FavoritesState>>
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

function normalizeFavorites(raw: Partial<FavoritesState> | undefined | null): FavoritesState {
  const source = (raw ?? {}) as Partial<Record<FavType, unknown>>
  const toStrArray = (v: unknown): string[] => (Array.isArray(v) ? v.map(String) : [])
  return {
    spots: toStrArray(source.spots),
    foods: toStrArray(source.foods),
    souvenirs: toStrArray(source.souvenirs),
    events: toStrArray(source.events),
  }
}

function readFavorites(): FavoritesState {
  if (typeof window === 'undefined') {
    return normalizeFavorites({})
  }

  try {
    const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY) || '{}'
    return normalizeFavorites(JSON.parse(raw) as Partial<FavoritesState>)
  } catch {
    return normalizeFavorites({})
  }
}

interface FavoritesProviderProps {
  children: ReactNode
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [favorites, setFavorites] = useState<FavoritesState>(readFavorites)

  useEffect(() => {
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === FAVORITES_STORAGE_KEY) {
        setFavorites(readFavorites())
      }
    }

    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const isFav = useCallback(
    (type: FavType, id: string) => {
      return (favorites[type] || []).includes(String(id))
    },
    [favorites],
  )

  const toggleFav = useCallback((type: FavType, id: string): boolean => {
    const sid = String(id)
    let added = false

    setFavorites((current) => {
      const next = normalizeFavorites(current)
      const list = next[type] || []
      const exists = list.includes(sid)
      added = !exists
      next[type] = exists ? list.filter((item) => item !== sid) : [...list, sid]
      return next
    })

    return added
  }, [])

  const value = useMemo<FavoritesContextValue>(
    () => ({
      favorites,
      counts: getFavoriteCounts(favorites),
      isFav,
      toggleFav,
      setFavorites,
    }),
    [favorites, isFav, toggleFav],
  )

  return createElement(FavoritesContext.Provider, { value }, children)
}

export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites 必须在 FavoritesProvider 内使用')
  }
  return context
}
