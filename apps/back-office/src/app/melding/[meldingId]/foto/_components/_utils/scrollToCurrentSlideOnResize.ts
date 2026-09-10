import type { RefObject } from 'react'

import { scrollToSlide } from './scrollToSlide'

type Args = {
  currentSlideIndex: number
  ref: RefObject<HTMLDivElement | null>
}

export const scrollToCurrentSlideOnResize = ({ currentSlideIndex, ref }: Args) => {
  if (!ref.current?.children[currentSlideIndex]) return

  scrollToSlide(currentSlideIndex, ref)
}
