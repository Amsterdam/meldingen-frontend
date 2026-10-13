export type Point = { x: number; y: number }

/**
 * The image is moved from its top left corner with `translate(x%, y%) scale(zoomLevel)`.
 * Clamping the offset between minus the overflow and 0 keeps the edges of the image within the button.
 */
export const clampOffset = (offset: Point, zoomLevel: number) => {
  // The overflow is the zoomed image size minus the button size.
  // For example, at zoom level 4 the image is 400% of the button, so the overflow is 400% - 100% = 300%.
  const overflow = 100 * zoomLevel - 100
  // Moving left or up is negative, so the image can move at most the overflow in that direction
  const min = -overflow

  return {
    x: Math.min(Math.max(offset.x, min), 0),
    y: Math.min(Math.max(offset.y, min), 0),
  }
}
