import { useEffect, useState } from 'react'

/**
 * useScrollSpy —— 基于固定导航栏下方的“阅读线”计算当前 section。
 *
 * 之前使用 IntersectionObserver 的窄 rootMargin，在长短 section 交界处容易提前/滞后。
 * 这里改为 scroll/resize 时直接按 DOM 位置计算：阅读线落在哪个 section，就激活哪个 section。
 */
export function useScrollSpy(sectionIds: string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!sectionIds.length) {
      setActiveId(null)
      return
    }

    let frame = 0

    const getElements = () =>
      sectionIds
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => Boolean(el))

    const computeActive = () => {
      frame = 0
      const elements = getElements()
      if (!elements.length) {
        setActiveId(null)
        return
      }

      const navHeight = document.getElementById('nav')?.getBoundingClientRect().height ?? 64
      const activationY = navHeight + Math.min(160, window.innerHeight * 0.28)
      const viewportBottom = window.innerHeight

      let next = elements[0].id
      let closestDistance = Number.POSITIVE_INFINITY

      for (const element of elements) {
        const rect = element.getBoundingClientRect()
        const containsLine = rect.top <= activationY && rect.bottom > activationY
        if (containsLine) {
          next = element.id
          break
        }

        if (rect.top <= viewportBottom && rect.bottom >= navHeight) {
          const distance = Math.abs(rect.top - activationY)
          if (distance < closestDistance) {
            closestDistance = distance
            next = element.id
          }
        }
      }

      setActiveId((current) => (current === next ? current : next))
    }

    const scheduleCompute = () => {
      if (frame) return
      frame = window.requestAnimationFrame(computeActive)
    }

    computeActive()
    window.addEventListener('scroll', scheduleCompute, { passive: true })
    window.addEventListener('resize', scheduleCompute)
    window.addEventListener('hashchange', scheduleCompute)

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', scheduleCompute)
      window.removeEventListener('resize', scheduleCompute)
      window.removeEventListener('hashchange', scheduleCompute)
    }
  }, [sectionIds.join('|')])

  return activeId
}

export default useScrollSpy
