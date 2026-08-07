'use client'

import { Button } from '@amsterdam/design-system-react'
import { ChevronBackwardIcon, ChevronForwardIcon } from '@amsterdam/design-system-react-icons'
import NextImage from 'next/image'
import { useEffect, useRef, useState } from 'react'

import { debounce, scrollToCurrentSlideOnResize, scrollToSlide, setCurrentSlideIdToVisibleSlide } from './_utils'
import { ImageSliderThumbnails } from './ImageSliderThumbnails'

/**
 * This component is copied from the Amsterdam Design System React package and modified to fit our needs.
 * The original component is not used because it does not support the use of Blob or File objects as images.
 * https://github.com/Amsterdam/design-system/tree/develop/packages/react/src/ImageSlider
 */

export const ImageSlider = ({ images }: { images: (Blob | File)[] }) => {
  const [currentSlideId, setCurrentSlideId] = useState(0)
  const [imageUrls, setImageUrls] = useState<string[]>([])

  const scrollerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const urls = images.map((image) => URL.createObjectURL(image))
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

    return () => window.removeEventListener('resize', handleResize)
  }, [currentSlideId, images.length])

  if (images.length === 0) return null

  const isAtStart = currentSlideId === 0
  const isAtEnd = currentSlideId === images.length - 1

  return (
    <section aria-roledescription="carousel" className="ams-image-slider">
      <div className="ams-image-slider__controls">
        <Button
          className="ams-image-slider__control"
          disabled={isAtStart}
          icon={ChevronBackwardIcon}
          iconOnly
          onClick={() => scrollToSlide(currentSlideId - 1, scrollerRef)}
        >
          Vorige
        </Button>
        <Button
          className="ams-image-slider__control"
          disabled={isAtEnd}
          icon={ChevronForwardIcon}
          iconOnly
          onClick={() => scrollToSlide(currentSlideId + 1, scrollerRef)}
        >
          Volgende
        </Button>
      </div>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
      <div className="ams-image-slider__scroller" ref={scrollerRef} tabIndex={0}>
        {imageUrls.map((imageUrl, index) => (
          <div
            aria-hidden={currentSlideId !== index}
            className="ams-image-slider__slide"
            id={`slide${index + 1}`}
            key={imageUrl}
            role="tabpanel"
            style={{ height: '600px', position: 'relative', width: '100%' }}
          >
            <NextImage
              alt=""
              className="ams-image-slider__slide"
              fill
              src={imageUrl}
              style={{ objectFit: 'contain' }}
            />
          </div>
        ))}
      </div>
      <ImageSliderThumbnails
        currentSlideId={currentSlideId}
        images={imageUrls}
        scrollToSlide={(id) => scrollToSlide(id, scrollerRef)}
      />
    </section>
  )
}
