import type { MouseEvent } from 'react'

export const getPointerPositionInPercentages = (event: MouseEvent<HTMLElement>) => {
  const { height, left, top, width } = event.currentTarget.getBoundingClientRect()

  return {
    x: ((event.clientX - left) / width) * 100,
    y: ((event.clientY - top) / height) * 100,
  }
}
