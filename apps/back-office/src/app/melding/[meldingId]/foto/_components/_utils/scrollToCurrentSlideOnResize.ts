import type { RefObject } from 'react'

import { scrollToSlide } from './scrollToSlide'

type Args = {
  currentSlideIndex: number
  ref: RefObject<HTMLDivElement | null>
}

// Re-center the current slide after a resize. `scrollToSlide` resolves the inline axis from the
// writing direction, so we don’t need a `scrollLeft` comparison (which is wrong in right-to-left
// contexts anyway).
export const scrollToCurrentSlideOnResize = ({ currentSlideIndex, ref }: Args) => {
  if (!ref.current?.children[currentSlideIndex]) return

  scrollToSlide(currentSlideIndex, ref)
}
