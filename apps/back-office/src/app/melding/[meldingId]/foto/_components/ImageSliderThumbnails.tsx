import type { KeyboardEvent } from 'react'

import { clsx } from 'clsx'
import { useTranslations } from 'next-intl'

type Props = {
  currentSlideId: number
  images: string[]
  scrollToSlide: (id: number) => void
}

export const ImageSliderThumbnails = ({ currentSlideId, images, scrollToSlide }: Props) => {
  const t = useTranslations('photos.image-slider')

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const element = event.currentTarget.children[currentSlideId]

    if (event.key === 'ArrowRight') {
      const nextElement = element?.nextElementSibling as HTMLElement | null

      if (nextElement) {
        nextElement.focus()
        scrollToSlide(currentSlideId + 1)
      }
    }

    if (event.key === 'ArrowLeft') {
      const previousElement = element?.previousElementSibling as HTMLElement | null

      if (previousElement) {
        previousElement.focus()
        scrollToSlide(currentSlideId - 1)
      }
    }
  }

  return (
    // eslint-disable-next-line jsx-a11y/interactive-supports-focus
    <div className="ams-image-slider__thumbnails" onKeyDown={handleKeyDown} role="tablist">
      {images.map((imageUrl, index) => (
        <button
          aria-controls={`slide${index + 1}`}
          aria-selected={currentSlideId === index ? 'true' : 'false'}
          className={clsx(
            'ams-image-slider__thumbnail',
            currentSlideId === index && 'ams-image-slider__thumbnail--in-view',
          )}
          id={`tab${index + 1}`}
          key={imageUrl}
          onClick={() => scrollToSlide(index)}
          role="tab"
          style={{ backgroundImage: `url(${imageUrl})` }}
          tabIndex={currentSlideId === index ? 0 : -1}
          type="button"
        >
          <span className="ams-visually-hidden">{`${t('thumbnail-button-prefix')} ${index + 1}`}</span>
        </button>
      ))}
    </div>
  )
}
