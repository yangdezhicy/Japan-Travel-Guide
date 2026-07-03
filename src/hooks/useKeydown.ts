import { useEffect } from 'react'

export default function useKeydown(
  key: string,
  handler: (event: KeyboardEvent) => void,
  enabled: boolean = true,
): void {
  useEffect(() => {
    if (!enabled) return undefined

    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === key) {
        handler(event)
      }
    }

    window.addEventListener('keydown', onKeydown)
    return () => window.removeEventListener('keydown', onKeydown)
  }, [enabled, handler, key])
}
