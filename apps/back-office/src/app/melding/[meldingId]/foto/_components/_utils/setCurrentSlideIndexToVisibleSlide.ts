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
      setCurrentSlideIndex(images.indexOf(observation.target as HTMLElement))
    }
  })
}
