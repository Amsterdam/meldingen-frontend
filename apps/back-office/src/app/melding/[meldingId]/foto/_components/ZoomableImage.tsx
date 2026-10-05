import type { MouseEvent, PointerEvent } from 'react'

import { Image } from '@amsterdam/design-system-react'
import { clsx } from 'clsx'
import { useTranslations } from 'next-intl'
import { useRef, useState } from 'react'

import type { Point } from './_utils'

import { clampOffset, getPointerPositionInPercentages } from './_utils'

import styles from './ZoomableImage.module.css'

const ZOOM_LEVELS = [1, 2, 4]

// A touch that moves more than this many pixels is a drag, not a tap
const DRAG_THRESHOLD = 10

type Props = {
  src: string
}

export const ZoomableImage = ({ src }: Props) => {
  const t = useTranslations('photos.image-slider')

  const [zoomLevelIndex, setZoomLevelIndex] = useState(0)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isZooming, setIsZooming] = useState(false)

  const touchStartRef = useRef<{ clientX: number; clientY: number; hasMoved: boolean; offset: Point } | null>(null)
  const isTouchInputRef = useRef(false)

  const zoomLevel = ZOOM_LEVELS[zoomLevelIndex]
  const isZoomedIn = zoomLevel > 1
  const isMaxZoom = zoomLevelIndex === ZOOM_LEVELS.length - 1

  const zoomAt = (point: Point) => {
    const nextZoomLevelIndex = (zoomLevelIndex + 1) % ZOOM_LEVELS.length
    const nextZoomLevel = ZOOM_LEVELS[nextZoomLevelIndex]
    const zoomFactor = nextZoomLevel / zoomLevel

    // Keep the part of the image under the point in the same place
    const nextOffset = {
      x: point.x - (point.x - offset.x) * zoomFactor,
      y: point.y - (point.y - offset.y) * zoomFactor,
    }

    setOffset(clampOffset(nextOffset, nextZoomLevel))
    setZoomLevelIndex(nextZoomLevelIndex)

    // Only animate zooming, so panning follows the pointer without delay
    setIsZooming(true)
  }

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    // A click from the keyboard has no pointer position (detail is 0), so we zoom in on the center
    if (event.detail === 0) {
      zoomAt({ x: 50, y: 50 })
    } else if (!isTouchInputRef.current) {
      zoomAt(getPointerPositionInPercentages(event))
    }
  }

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    isTouchInputRef.current = event.pointerType !== 'mouse'

    if (!isTouchInputRef.current) return

    touchStartRef.current = { clientX: event.clientX, clientY: event.clientY, hasMoved: false, offset }
  }

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    // A mouse pans by hovering, touch and pen pan by dragging
    if (event.pointerType === 'mouse') {
      if (!isZoomedIn) return

      const pointer = getPointerPositionInPercentages(event)

      setOffset(clampOffset({ x: pointer.x * (1 - zoomLevel), y: pointer.y * (1 - zoomLevel) }, zoomLevel))

      return
    }

    const touchStart = touchStartRef.current

    if (!touchStart) return

    const deltaX = event.clientX - touchStart.clientX
    const deltaY = event.clientY - touchStart.clientY

    if (Math.hypot(deltaX, deltaY) > DRAG_THRESHOLD) touchStart.hasMoved = true

    if (!isZoomedIn) return

    const { height, width } = event.currentTarget.getBoundingClientRect()
    const draggedOffset = {
      x: touchStart.offset.x + (deltaX / width) * 100,
      y: touchStart.offset.y + (deltaY / height) * 100,
    }

    setOffset(clampOffset(draggedOffset, zoomLevel))
  }

  const handlePointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    const touchStart = touchStartRef.current

    touchStartRef.current = null

    // A drag should not also change the zoom level
    if (touchStart && !touchStart.hasMoved) zoomAt(getPointerPositionInPercentages(event))
  }

  const handlePointerCancel = () => {
    touchStartRef.current = null
  }

  return (
    <button
      className={clsx(styles.button, isZoomedIn && styles.zoomedIn, isMaxZoom && styles.zoomOut)}
      onClick={handleClick}
      onPointerCancel={handlePointerCancel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      type="button"
    >
      <span className="ams-visually-hidden">
        {isMaxZoom ? t('zoom-out') : t('zoom-in', { zoomLevel: ZOOM_LEVELS[zoomLevelIndex + 1] * 100 })}
      </span>
      <Image
        alt=""
        className={clsx(styles.image, isZooming && styles.zooming)}
        onTransitionEnd={() => setIsZooming(false)}
        src={src}
        style={{ transform: `translate(${offset.x}%, ${offset.y}%) scale(${zoomLevel})` }}
      />
    </button>
  )
}
