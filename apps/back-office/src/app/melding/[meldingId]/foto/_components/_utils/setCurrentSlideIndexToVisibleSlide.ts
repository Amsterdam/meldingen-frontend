import type { RefObject } from 'react'

type Args = {
  observations: IntersectionObserverEntry[]
  ref: RefObject<HTMLDivElement | null>
  setCurrentSlideIndex: (index: number) => void
}

export const setCurrentSlideIndexToVisibleSlide = ({ observations, ref, setCurrentSlideIndex }: Args) => {
  const images = Array.from(ref.current?.children || [])

  if (images.length === 0) return

  observations.forEach((observation) => {
    if (observation.isIntersecting) {
      const focusedSlide = images.find((slide) => slide.contains(document.activeElement))

      // The previous slide becomes inert, which would remove focus from the image slider.
      // Moving focus to the scroller keeps the arrow keys working when scrolling with the keyboard.
      if (focusedSlide && focusedSlide !== observation.target) {
        ref.current?.focus({ preventScroll: true })
      }

      setCurrentSlideIndex(images.indexOf(observation.target as HTMLElement))
    }
  })
}
