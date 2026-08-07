'use client'

import { Button, Figure, Image } from '@amsterdam/design-system-react'
import { ChevronBackwardIcon, ChevronForwardIcon } from '@amsterdam/design-system-react-icons'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'

import { debounce, scrollToCurrentSlideOnResize, scrollToSlide, setCurrentSlideIdToVisibleSlide } from './_utils'
import { ImageSliderThumbnails } from './ImageSliderThumbnails'

import styles from './ImageSlider.module.css'

/**
 * This component is copied from the Amsterdam Design System React package and modified to fit our needs.
 * The original component is not used because it does not support the use of Blob or File objects as images.
 * https://github.com/Amsterdam/design-system/tree/develop/packages/react/src/ImageSlider
 */

type Props = {
  images: {
    createdAt: string
    data: Blob | File
    filename: string
    id: number
  }[]
  labelId: string
}

export const ImageSlider = ({ images, labelId }: Props) => {
  const t = useTranslations('photos.image-slider')

  const [currentSlideId, setCurrentSlideId] = useState(0)
  const [imageUrls, setImageUrls] = useState<string[]>([])

  const scrollerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const urls = images.map((image) => URL.createObjectURL(image.data))
    setImageUrls(urls)

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [images])

  useEffect(() => {
    if (!scrollerRef.current) return undefined

    const observerOptions = {
      root: scrollerRef.current,
      threshold: 0.6,
    }

    const observer = new IntersectionObserver(
      (observations) => setCurrentSlideIdToVisibleSlide({ observations, ref: scrollerRef, setCurrentSlideId }),
      observerOptions,
    )

    const slides = Array.from(scrollerRef.current.children)
    slides.forEach((slide) => observer.observe(slide))

    return () => observer.disconnect()
  }, [imageUrls])

  useEffect(() => {
    if (images.length === 0) return undefined

    const handleResize = debounce(() => scrollToCurrentSlideOnResize({ currentSlideId, ref: scrollerRef }), 100)

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      handleResize.cancel()
    }
  }, [currentSlideId, images.length])

  if (images.length === 0) return null

  const goToSlide = (id: number) => {
    setCurrentSlideId(id)
    scrollToSlide(id, scrollerRef)
  }

  const isAtStart = currentSlideId === 0
  const isAtEnd = currentSlideId === images.length - 1

  return (
    <section aria-labelledby={labelId} aria-roledescription="carousel" className="ams-image-slider">
      <div className="ams-image-slider__controls">
        <Button
          className="ams-image-slider__control"
          disabled={isAtStart}
          icon={ChevronBackwardIcon}
          iconOnly
          onClick={() => goToSlide(currentSlideId - 1)}
        >
          {t('previous')}
        </Button>
        <Button
          className="ams-image-slider__control"
          disabled={isAtEnd}
          icon={ChevronForwardIcon}
          iconOnly
          onClick={() => goToSlide(currentSlideId + 1)}
        >
          {t('next')}
        </Button>
      </div>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
      <div aria-labelledby={labelId} className="ams-image-slider__scroller" ref={scrollerRef} tabIndex={0}>
        {imageUrls.map((imageUrl, index) => (
          <div
            aria-hidden={currentSlideId !== index}
            aria-labelledby={`tab${index + 1}`}
            className="ams-image-slider__slide"
            id={`slide${index + 1}`}
            key={imageUrl}
            role="tabpanel"
          >
            <Figure>
              <Figure.Caption>{images[index].filename}</Figure.Caption>
              <div className={styles.imageContainer}>
                <Image alt="" className={styles.image} src={imageUrl} />
              </div>
            </Figure>
          </div>
        ))}
      </div>
      <ImageSliderThumbnails currentSlideId={currentSlideId} images={imageUrls} scrollToSlide={goToSlide} />
    </section>
  )
}
