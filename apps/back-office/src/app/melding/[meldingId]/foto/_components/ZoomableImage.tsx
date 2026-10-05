import type { MouseEvent, PointerEvent } from 'react'

import { Image } from '@amsterdam/design-system-react'
import { clsx } from 'clsx'
import { useTranslations } from 'next-intl'
import { useRef, useState } from 'react'

import styles from './ZoomableImage.module.css'

const ZOOM_LEVELS = [1, 2, 4]

const CENTER = { x: 50, y: 50 }

// A touch that moves more than this many pixels is a drag, not a tap
const DRAG_THRESHOLD = 10

type Origin = typeof CENTER

const clampPercentage = (value: number) => Math.min(Math.max(value, 0), 100)

const getPointerPositionInPercentages = (event: MouseEvent<HTMLButtonElement>) => {
  const { height, left, top, width } = event.currentTarget.getBoundingClientRect()

  return {
    x: clampPercentage(((event.clientX - left) / width) * 100),
    y: clampPercentage(((event.clientY - top) / height) * 100),
  }
}

/**
 * Moves the transform origin so the image follows the finger.
 * When zoomed in by a factor of `zoomLevel`, moving the origin by 1% moves the image by `zoomLevel - 1`% in the opposite direction.
 */
const getDraggedOrigin = (startOrigin: Origin, deltaX: number, deltaY: number, rect: DOMRect, zoomLevel: number) => ({
  x: clampPercentage(startOrigin.x - (deltaX / (rect.width * (zoomLevel - 1))) * 100),
  y: clampPercentage(startOrigin.y - (deltaY / (rect.height * (zoomLevel - 1))) * 100),
})

/**
 * Returns the transform origin that keeps the part of the image under the tap in the same place when zooming.
 * With zoom level `s` and origin `o`, the image point `p` is shown at `o + s * (p - o)`.
 */
const getZoomedOrigin = (origin: Origin, tap: Origin, zoomLevel: number, nextZoomLevel: number) => {
  const getAxis = (originAxis: number, tapAxis: number) => {
    const imagePoint = originAxis + (tapAxis - originAxis) / zoomLevel

    return clampPercentage((tapAxis - nextZoomLevel * imagePoint) / (1 - nextZoomLevel))
  }

  return { x: getAxis(origin.x, tap.x), y: getAxis(origin.y, tap.y) }
}

type Props = {
  src: string
}

export const ZoomableImage = ({ src }: Props) => {
  const t = useTranslations('photos.image-slider')

  const [zoomLevelIndex, setZoomLevelIndex] = useState(0)
  const [origin, setOrigin] = useState(CENTER)

  const dragStartRef = useRef<{ clientX: number; clientY: number; origin: Origin } | null>(null)
  const hasDraggedRef = useRef(false)

  const zoomLevel = ZOOM_LEVELS[zoomLevelIndex]
  const isZoomedIn = zoomLevel > 1
  const isMaxZoom = zoomLevelIndex === ZOOM_LEVELS.length - 1

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    // A click from the keyboard has no pointer position (detail is 0), so we zoom in on the center
    const isKeyboardClick = event.detail === 0

    // A finished drag should not also change the zoom level
    if (hasDraggedRef.current && !isKeyboardClick) return

    const nextZoomLevelIndex = (zoomLevelIndex + 1) % ZOOM_LEVELS.length
    const nextZoomLevel = ZOOM_LEVELS[nextZoomLevelIndex]

    // Keep the origin when zooming out, so the image zooms out from where it was
    if (nextZoomLevel > 1) {
      const tap = isKeyboardClick ? CENTER : getPointerPositionInPercentages(event)

      setOrigin(getZoomedOrigin(origin, tap, zoomLevel, nextZoomLevel))
    }

    setZoomLevelIndex(nextZoomLevelIndex)
  }

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    hasDraggedRef.current = false

    if (!isZoomedIn || event.pointerType === 'mouse') return

    dragStartRef.current = { clientX: event.clientX, clientY: event.clientY, origin }
  }

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (!isZoomedIn) return

    // A mouse pans by hovering, touch and pen pan by dragging
    if (event.pointerType === 'mouse') {
      setOrigin(getPointerPositionInPercentages(event))

      return
    }

    const dragStart = dragStartRef.current

    if (!dragStart) return

    const deltaX = event.clientX - dragStart.clientX
    const deltaY = event.clientY - dragStart.clientY

    if (Math.hypot(deltaX, deltaY) > DRAG_THRESHOLD) hasDraggedRef.current = true

    const rect = event.currentTarget.getBoundingClientRect()

    setOrigin(getDraggedOrigin(dragStart.origin, deltaX, deltaY, rect, zoomLevel))
  }

  const handlePointerEnd = () => {
    dragStartRef.current = null
  }

  return (
    <button
      className={clsx(styles.button, isZoomedIn && styles.zoomedIn, isMaxZoom && styles.zoomOut)}
      onClick={handleClick}
      onPointerCancel={handlePointerEnd}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      type="button"
    >
      <span className="ams-visually-hidden">
        {isMaxZoom ? t('zoom-out') : t('zoom-in', { zoomLevel: ZOOM_LEVELS[zoomLevelIndex + 1] * 100 })}
      </span>
      <Image
        alt=""
        className={styles.image}
        src={src}
        style={{ transform: `scale(${zoomLevel})`, transformOrigin: `${origin.x}% ${origin.y}%` }}
      />
    </button>
  )
}
