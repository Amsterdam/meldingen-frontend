import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ImageSliderThumbnails } from './ImageSliderThumbnails'

const images = [
  { id: 1, url: 'image-1.jpg' },
  { id: 2, url: 'image-2.jpg' },
  { id: 3, url: 'image-3.jpg' },
]

const defaultProps = { currentSlideIndex: 0, images: images, scrollToSlide: vi.fn() }

describe('ImageSliderThumbnails', () => {
  it('renders', () => {
    render(<ImageSliderThumbnails {...defaultProps} />)

    const thumbnail1 = screen.getByRole('tab', { name: 'thumbnail-button-prefix 1' })
    const thumbnail2 = screen.getByRole('tab', { name: 'thumbnail-button-prefix 2' })
    const thumbnail3 = screen.getByRole('tab', { name: 'thumbnail-button-prefix 3' })

    expect(thumbnail1).toBeInTheDocument()
    expect(thumbnail2).toBeInTheDocument()
    expect(thumbnail3).toBeInTheDocument()
  })

  it.each([
    { expected: 1, focusedThumbnail: 0, key: '{ArrowRight}', startIndex: 0 },
    { expected: 0, focusedThumbnail: 1, key: '{ArrowLeft}', startIndex: 1 },
    { expected: 0, focusedThumbnail: 1, key: '{Home}', startIndex: 1 },
    { expected: images.length - 1, focusedThumbnail: 1, key: '{End}', startIndex: 1 },
  ])('calls scrollToSlide with $expected on $key keydown', async ({ expected, focusedThumbnail, key, startIndex }) => {
    const scrollToSlide = vi.fn()

    const user = userEvent.setup()

    const { container } = render(
      <ImageSliderThumbnails {...defaultProps} currentSlideIndex={startIndex} scrollToSlide={scrollToSlide} />,
    )

    const component = container.querySelector(':only-child') as HTMLElement

    const thumbnail = component.children[focusedThumbnail] as HTMLElement
    thumbnail.focus()

    await user.keyboard(key)

    expect(scrollToSlide).toHaveBeenCalledWith(expected)
  })

  it.each([
    { boundaryIndex: images.length - 1, description: 'end', key: '{ArrowRight}' },
    { boundaryIndex: 0, description: 'start', key: '{ArrowLeft}' },
    { boundaryIndex: 0, description: 'start', key: '{Home}' },
    { boundaryIndex: images.length - 1, description: 'end', key: '{End}' },
  ])('does not call scrollToSlide on $key keydown when at $description', async ({ boundaryIndex, key }) => {
    const scrollToSlide = vi.fn()

    const user = userEvent.setup()

    const { container } = render(
      <ImageSliderThumbnails {...defaultProps} currentSlideIndex={boundaryIndex} scrollToSlide={scrollToSlide} />,
    )

    const component = container.querySelector(':only-child') as HTMLElement

    const thumbnail = component.children[boundaryIndex] as HTMLElement
    thumbnail.focus()

    await user.keyboard(key)

    expect(scrollToSlide).not.toHaveBeenCalled()
  })

  it('calls scrollToSlide on thumbnail click', async () => {
    const scrollToSlide = vi.fn()

    const user = userEvent.setup()

    const { container } = render(<ImageSliderThumbnails {...defaultProps} scrollToSlide={scrollToSlide} />)

    const component = container.querySelector(':only-child') as HTMLElement

    const secondThumbnail = component.children[1] as HTMLElement

    await user.click(secondThumbnail)

    expect(scrollToSlide).toHaveBeenCalledWith(1)
  })
})
