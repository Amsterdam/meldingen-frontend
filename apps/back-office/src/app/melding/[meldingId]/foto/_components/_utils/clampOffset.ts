export type Point = { x: number; y: number }

/**
 * The image is moved from its top left corner with `translate(x%, y%) scale(zoomLevel)`.
 * Clamping the offset between `100 * (1 - zoomLevel)` and 0 keeps the edges of the image within the button.
 */
export const clampOffset = (offset: Point, zoomLevel: number) => {
  const min = 100 * (1 - zoomLevel)

  return {
    x: Math.min(Math.max(offset.x, min), 0),
    y: Math.min(Math.max(offset.y, min), 0),
  }
}
