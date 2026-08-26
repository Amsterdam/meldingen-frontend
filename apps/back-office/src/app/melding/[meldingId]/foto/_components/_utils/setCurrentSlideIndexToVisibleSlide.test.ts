import type { RefObject } from 'react'

import { describe, expect, it, vi } from 'vitest'

import { setCurrentSlideIndexToVisibleSlide } from './setCurrentSlideIndexToVisibleSlide'

describe('setCurrentSlideIndexToVisibleSlide', () => {
  it('calls setCurrentSlideIndex with the index of the intersecting element', () => {
    const setCurrentSlideIndex = vi.fn()
    const element1 = {} as HTMLElement
    const element2 = {} as HTMLElement
    const ref = { current: { children: [element1, element2] } } as unknown as RefObject<HTMLDivElement>
    const observations = [
      { isIntersecting: false, target: element1 } as unknown as IntersectionObserverEntry,
      { isIntersecting: true, target: element2 } as unknown as IntersectionObserverEntry,
    ]

    setCurrentSlideIndexToVisibleSlide({ observations, ref, setCurrentSlideIndex })

    expect(setCurrentSlideIndex).toHaveBeenCalledWith(1)
  })

  it('does not call setCurrentSlideIndex if no element is intersecting', () => {
    const setCurrentSlideIndex = vi.fn()
    const element1 = {} as HTMLElement
    const element2 = {} as HTMLElement
    const ref = { current: { children: [element1, element2] } } as unknown as RefObject<HTMLDivElement>
    const observations = [
      { isIntersecting: false, target: element1 } as unknown as IntersectionObserverEntry,
      { isIntersecting: false, target: element2 } as unknown as IntersectionObserverEntry,
    ]

    setCurrentSlideIndexToVisibleSlide({ observations, ref, setCurrentSlideIndex })

    expect(setCurrentSlideIndex).not.toHaveBeenCalled()
  })

  it('returns undefined for empty children array', () => {
    const setCurrentSlideIndex = vi.fn()
    const ref = { current: { children: [] } } as unknown as RefObject<HTMLDivElement>
    const observations = [{ isIntersecting: true, target: {} } as IntersectionObserverEntry]

    const result = setCurrentSlideIndexToVisibleSlide({ observations, ref, setCurrentSlideIndex })

    expect(result).toBeUndefined()
  })

  it('returns undefined if ref.current is null', () => {
    const setCurrentSlideIndex = vi.fn()
    const ref = { current: null } as unknown as RefObject<HTMLDivElement>
    const observations = [{ isIntersecting: true, target: {} } as IntersectionObserverEntry]

    const result = setCurrentSlideIndexToVisibleSlide({ observations, ref, setCurrentSlideIndex })

    expect(result).toBeUndefined()
  })
})
