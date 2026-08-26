import type { KeyboardEvent } from 'react'

import { clsx } from 'clsx'
import { useTranslations } from 'next-intl'

type Props = {
  currentSlideId: number
  images: { id: number; url: string }[]
  scrollToSlide: (id: number) => void
}

export const ImageSliderThumbnails = ({ currentSlideId, images, scrollToSlide }: Props) => {
  const t = useTranslations('photos.image-slider')

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const tabs = event.currentTarget.children
    const element = tabs[currentSlideId]

    const focusAndGoToSlide = (target: Element | null, id: number) => {
      if (!target) return

      ;(target as HTMLElement).focus()
      scrollToSlide(id)
    }

    if (event.key === 'ArrowRight') {
      focusAndGoToSlide(element?.nextElementSibling ?? null, currentSlideId + 1)
    }

    if (event.key === 'ArrowLeft') {
      focusAndGoToSlide(element?.previousElementSibling ?? null, currentSlideId - 1)
    }

    if (event.key === 'Home') {
      event.preventDefault()
      if (currentSlideId !== 0) focusAndGoToSlide(tabs[0], 0)
    }

    if (event.key === 'End') {
      event.preventDefault()
      if (currentSlideId !== tabs.length - 1) focusAndGoToSlide(tabs[tabs.length - 1], tabs.length - 1)
    }
  }

  return (
    // eslint-disable-next-line jsx-a11y/interactive-supports-focus
    <div className="ams-image-slider__thumbnails" onKeyDown={handleKeyDown} role="tablist">
      {images.map(({ id, url }, index) => (
        <button
          aria-controls={`slide${index + 1}`}
          aria-selected={currentSlideId === index ? 'true' : 'false'}
          className={clsx(
            'ams-image-slider__thumbnail',
            currentSlideId === index && 'ams-image-slider__thumbnail--in-view',
          )}
          id={`tab${index + 1}`}
          key={id}
          onClick={() => scrollToSlide(index)}
          role="tab"
          style={{ backgroundImage: `url(${url})` }}
          tabIndex={currentSlideId === index ? 0 : -1}
          type="button"
        >
          <span className="ams-visually-hidden">{`${t('thumbnail-button-prefix')} ${index + 1}`}</span>
        </button>
      ))}
    </div>
  )
}
