'use client'

import { Button, Figure, Image } from '@amsterdam/design-system-react'
import { ChevronBackwardIcon, ChevronForwardIcon } from '@amsterdam/design-system-react-icons'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'

import { debounce, scrollToCurrentSlideOnResize, scrollToSlide, setCurrentSlideIndexToVisibleSlide } from './_utils'
import { ImageSliderThumbnails } from './ImageSliderThumbnails'

import styles from './ImageSlider.module.css'

/**
 * This component is copied from the Amsterdam Design System React package and modified to fit our needs.
 * The original component is not used because it does not support the use of Blob or File objects as images,
 * the caption is styled differently and it does not support image zoom.
 * https://github.com/Amsterdam/design-system/tree/develop/packages/react/src/ImageSlider
 */

type Props = {
  defaultSlideIndex?: number
  images: {
    createdAt: string
    data: Blob | File
    filename: string
    id: number
  }[]
  labelId: string
}

// TODO: Remove this function and use formatDateString instead, once we've added the correct defaults there.
export const formatDateTime = (dateString: string) => {
  const date = new Date(dateString)

  const formattedDate = date.toLocaleDateString('nl-NL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
  const formattedTime = date.toLocaleTimeString('nl-NL', {
    hour: 'numeric',
    minute: 'numeric',
  })

  return `${formattedDate} ${formattedTime}`
}

export const ImageSlider = ({ defaultSlideIndex, images, labelId }: Props) => {
  const t = useTranslations('photos.image-slider')

  const [currentSlideIndex, setCurrentSlideIndex] = useState(defaultSlideIndex ?? 0)
  const [imageUrls, setImageUrls] = useState<{ id: number; url: string }[]>([])

  const scrollerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const urls = images.map((image) => ({ id: image.id, url: URL.createObjectURL(image.data) }))
    setImageUrls(urls)

    return () => {
      urls.forEach(({ url }) => URL.revokeObjectURL(url))
    }
  }, [images])

  useEffect(() => {
    if (defaultSlideIndex === undefined) return

    scrollToSlide(defaultSlideIndex, scrollerRef, 'instant')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!scrollerRef.current) return undefined

    const observerOptions = {
      root: scrollerRef.current,
      threshold: 0.6,
    }

    const observer = new IntersectionObserver(
      (observations) => setCurrentSlideIndexToVisibleSlide({ observations, ref: scrollerRef, setCurrentSlideIndex }),
      observerOptions,
    )

    const slides = Array.from(scrollerRef.current.children)
    slides.forEach((slide) => observer.observe(slide))

    return () => observer.disconnect()
  }, [imageUrls])

  useEffect(() => {
    if (images.length === 0) return undefined

    const handleResize = debounce(() => scrollToCurrentSlideOnResize({ currentSlideIndex, ref: scrollerRef }), 100)

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      handleResize.cancel()
    }
  }, [currentSlideIndex, images.length])

  if (images.length === 0) return null

  const goToSlide = (index: number) => {
    setCurrentSlideIndex(index)
    scrollToSlide(index, scrollerRef)
  }

  const isAtStart = currentSlideIndex === 0
  const isAtEnd = currentSlideIndex === images.length - 1

  return (
    <section aria-labelledby={labelId} aria-roledescription="carousel" className="ams-image-slider">
      <div className="ams-image-slider__controls">
        <Button
          className="ams-image-slider__control"
          disabled={isAtStart}
          icon={ChevronBackwardIcon}
          iconOnly
          onClick={() => goToSlide(currentSlideIndex - 1)}
        >
          {t('previous')}
        </Button>
        <Button
          className="ams-image-slider__control"
          disabled={isAtEnd}
          icon={ChevronForwardIcon}
          iconOnly
          onClick={() => goToSlide(currentSlideIndex + 1)}
        >
          {t('next')}
        </Button>
      </div>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
      <div aria-labelledby={labelId} className="ams-image-slider__scroller" ref={scrollerRef} tabIndex={0}>
        {images.map(({ id }, index) => {
          const imageUrl = imageUrls.find((imageUrl) => imageUrl.id === id)

          return (
            <div
              aria-hidden={currentSlideIndex !== index}
              aria-labelledby={`tab${index + 1}`}
              className="ams-image-slider__slide"
              id={`slide${index + 1}`}
              key={id}
              role="tabpanel"
            >
              <Figure>
                <Figure.Caption className={styles.caption}>
                  <span className={styles.fileName}>{images[index].filename}</span>
                  <span>{formatDateTime(images[index].createdAt)}</span>
                </Figure.Caption>
                <div className={styles.imageContainer}>
                  {imageUrl ? (
                    <Image alt="" className={styles.image} src={imageUrl.url} />
                  ) : (
                    <div className={styles.loadingImage} />
                  )}
                </div>
              </Figure>
            </div>
          )
        })}
      </div>
      {imageUrls.length === 0 ? (
        <div className={styles.loadingThumbnail} />
      ) : (
        <ImageSliderThumbnails currentSlideIndex={currentSlideIndex} images={imageUrls} scrollToSlide={goToSlide} />
      )}
    </section>
  )
}
