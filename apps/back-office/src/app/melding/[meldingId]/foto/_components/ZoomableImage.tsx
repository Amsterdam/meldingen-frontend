import type { MouseEvent } from 'react'

import { Image } from '@amsterdam/design-system-react'
import { clsx } from 'clsx'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import styles from './ZoomableImage.module.css'

const ZOOM_LEVELS = [1, 2, 4]

const CENTER = { x: 50, y: 50 }

const clampPercentage = (value: number) => Math.min(Math.max(value, 0), 100)

const getPointerPositionInPercentages = (event: MouseEvent<HTMLButtonElement>) => {
  const { height, left, top, width } = event.currentTarget.getBoundingClientRect()

  return {
    x: clampPercentage(((event.clientX - left) / width) * 100),
    y: clampPercentage(((event.clientY - top) / height) * 100),
  }
}

type Props = {
  src: string
}

export const ZoomableImage = ({ src }: Props) => {
  const t = useTranslations('photos.image-slider')

  const [zoomLevelIndex, setZoomLevelIndex] = useState(0)
  const [origin, setOrigin] = useState(CENTER)

  const zoomLevel = ZOOM_LEVELS[zoomLevelIndex]
  const isZoomedIn = zoomLevel > 1
  const isMaxZoom = zoomLevelIndex === ZOOM_LEVELS.length - 1

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    // A click from the keyboard has no pointer position (detail is 0), so we zoom in on the center
    setOrigin(event.detail === 0 ? CENTER : getPointerPositionInPercentages(event))
    setZoomLevelIndex((zoomLevelIndex + 1) % ZOOM_LEVELS.length)
  }

  const handleMouseMove = (event: MouseEvent<HTMLButtonElement>) => {
    if (!isZoomedIn) return

    setOrigin(getPointerPositionInPercentages(event))
  }

  return (
    <button
      className={clsx(styles.button, isMaxZoom && styles.zoomOut)}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
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
