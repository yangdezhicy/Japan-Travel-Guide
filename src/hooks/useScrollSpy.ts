import { useEffect, useState } from 'react'

/**
 * useScrollSpy —— 观察多个 section 元素，返回当前处于视口"活跃区"的 section id。
 *
 * 建议 rootMargin: "-30% 0px -60% 0px"，threshold: 0，
 * 效果为：section 顶部滚到视口上 1/3 时即视为激活。
 */
export function useScrollSpy(
  sectionIds: string[],
  options?: IntersectionObserverInit,
): string | null {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (typeof IntersectionObserver === 'undefined') return
    if (!sectionIds.length) {
      setActiveId(null)
      return
    }

    const elements: HTMLElement[] = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el))

    if (!elements.length) {
      setActiveId(null)
      return
    }

    const visibility = new Map<string, number>()
    for (const el of elements) visibility.set(el.id, 0)

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).id
          if (!id) continue
          visibility.set(id, entry.isIntersecting ? entry.intersectionRatio || 1 : 0)
        }

        // 选择第一个（按 DOM 顺序 / sectionIds 顺序）当前处于活跃区的 section
        let next: string | null = null
        for (const id of sectionIds) {
          if ((visibility.get(id) || 0) > 0) {
            next = id
            break
          }
        }
        setActiveId(next)
      },
      {
        root: null,
        rootMargin: '-30% 0px -60% 0px',
        threshold: 0,
        ...(options || {}),
      },
    )

    for (const el of elements) observer.observe(el)
    return () => observer.disconnect()
    // 依赖：sectionIds 内容变化时重新绑定
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionIds.join('|')])

  return activeId
}

export default useScrollSpy
