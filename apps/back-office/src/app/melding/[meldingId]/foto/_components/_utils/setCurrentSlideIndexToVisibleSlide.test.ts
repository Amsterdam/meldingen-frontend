import type { RefObject } from 'react'

import { afterEach, describe, expect, it, vi } from 'vitest'

import { setCurrentSlideIndexToVisibleSlide } from './setCurrentSlideIndexToVisibleSlide'

describe('setCurrentSlideIndexToVisibleSlide', () => {
  it('calls setCurrentSlideIndex with the index of the intersecting element', () => {
    const setCurrentSlideIndex = vi.fn()
    const element1 = document.createElement('div')
    const element2 = document.createElement('div')
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
    const element1 = document.createElement('div')
    const element2 = document.createElement('div')
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

  describe('focus', () => {
    const setupSlider = () => {
      const scroller = document.createElement('div')
      const slide1 = document.createElement('div')
      const slide2 = document.createElement('div')
      const button1 = document.createElement('button')
      const button2 = document.createElement('button')
      const control = document.createElement('button')

      scroller.tabIndex = 0
      slide1.append(button1)
      slide2.append(button2)
      scroller.append(slide1, slide2)
      document.body.append(scroller, control)

      const ref = { current: scroller }
      const observeSlide2 = () =>
        setCurrentSlideIndexToVisibleSlide({
          observations: [{ isIntersecting: true, target: slide2 } as unknown as IntersectionObserverEntry],
          ref,
          setCurrentSlideIndex: vi.fn(),
        })

      return { button1, button2, control, observeSlide2, scroller }
    }

    afterEach(() => {
      document.body.innerHTML = ''
    })

    it('moves focus to the scroller when the focused slide is no longer visible', () => {
      const { button1, observeSlide2, scroller } = setupSlider()

      button1.focus()
      observeSlide2()

      expect(scroller).toHaveFocus()
    })

    it('keeps focus in the visible slide', () => {
      const { button2, observeSlide2 } = setupSlider()

      button2.focus()
      observeSlide2()

      expect(button2).toHaveFocus()
    })

    it('keeps focus outside the slides, for example on the controls or thumbnails', () => {
      const { control, observeSlide2 } = setupSlider()

      control.focus()
      observeSlide2()

      expect(control).toHaveFocus()
    })
  })
})
