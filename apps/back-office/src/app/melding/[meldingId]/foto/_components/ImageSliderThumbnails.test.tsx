import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ImageSliderThumbnails } from './ImageSliderThumbnails'

const images = [
  {
    id: 1,
    url: 'image-1.jpg',
  },
  {
    id: 2,
    url: 'image-2.jpg',
  },
  {
    id: 3,
    url: 'image-3.jpg',
  },
]

const defaultProps = { currentSlideId: 0, images: images, scrollToSlide: vi.fn() }

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

  it('calls scrollToSlide on ArrowRight keydown', async () => {
    const scrollToSlide = vi.fn()

    const user = userEvent.setup()

    const { container } = render(<ImageSliderThumbnails {...defaultProps} scrollToSlide={scrollToSlide} />)

    const component = container.querySelector(':only-child') as HTMLElement

    const firstThumbnail = component.children[0] as HTMLElement
    firstThumbnail.focus()

    await user.keyboard('{ArrowRight}')

    expect(scrollToSlide).toHaveBeenCalledWith(1)
  })

  it('does not call scrollToSlide on ArrowRight keydown when at end', async () => {
    const scrollToSlide = vi.fn()

    const user = userEvent.setup()

    const { container } = render(
      <ImageSliderThumbnails {...defaultProps} currentSlideId={images.length - 1} scrollToSlide={scrollToSlide} />,
    )

    const component = container.querySelector(':only-child') as HTMLElement

    const lastThumbnail = component.children[images.length - 1] as HTMLElement
    lastThumbnail.focus()

    await user.keyboard('{ArrowRight}')

    expect(scrollToSlide).not.toHaveBeenCalled()
  })

  it('calls scrollToSlide on ArrowLeft keydown', async () => {
    const scrollToSlide = vi.fn()

    const user = userEvent.setup()

    const { container } = render(
      <ImageSliderThumbnails {...defaultProps} currentSlideId={1} scrollToSlide={scrollToSlide} />,
    )

    const component = container.querySelector(':only-child') as HTMLElement

    const secondThumbnail = component.children[1] as HTMLElement
    secondThumbnail.focus()

    await user.keyboard('{ArrowLeft}')

    expect(scrollToSlide).toHaveBeenCalledWith(0)
  })

  it('does not call scrollToSlide on ArrowLeft keydown when at start', async () => {
    const scrollToSlide = vi.fn()

    const user = userEvent.setup()

    const { container } = render(
      <ImageSliderThumbnails {...defaultProps} currentSlideId={0} scrollToSlide={scrollToSlide} />,
    )

    const component = container.querySelector(':only-child') as HTMLElement

    const firstThumbnail = component.children[0] as HTMLElement
    firstThumbnail.focus()

    await user.keyboard('{ArrowLeft}')

    expect(scrollToSlide).not.toHaveBeenCalled()
  })

  it('calls scrollToSlide on Home keydown', async () => {
    const scrollToSlide = vi.fn()

    const user = userEvent.setup()

    const { container } = render(
      <ImageSliderThumbnails {...defaultProps} currentSlideId={1} scrollToSlide={scrollToSlide} />,
    )

    const component = container.querySelector(':only-child') as HTMLElement

    const secondThumbnail = component.children[1] as HTMLElement
    secondThumbnail.focus()

    await user.keyboard('{Home}')

    expect(scrollToSlide).toHaveBeenCalledWith(0)
  })

  it('does not call scrollToSlide on Home keydown when at start', async () => {
    const scrollToSlide = vi.fn()

    const user = userEvent.setup()

    const { container } = render(
      <ImageSliderThumbnails {...defaultProps} currentSlideId={0} scrollToSlide={scrollToSlide} />,
    )

    const component = container.querySelector(':only-child') as HTMLElement

    const firstThumbnail = component.children[0] as HTMLElement
    firstThumbnail.focus()

    await user.keyboard('{Home}')

    expect(scrollToSlide).not.toHaveBeenCalled()
  })

  it('calls scrollToSlide on End keydown', async () => {
    const scrollToSlide = vi.fn()

    const user = userEvent.setup()

    const { container } = render(
      <ImageSliderThumbnails {...defaultProps} currentSlideId={1} scrollToSlide={scrollToSlide} />,
    )

    const component = container.querySelector(':only-child') as HTMLElement

    const secondThumbnail = component.children[1] as HTMLElement
    secondThumbnail.focus()

    await user.keyboard('{End}')

    expect(scrollToSlide).toHaveBeenCalledWith(images.length - 1)
  })

  it('does not call scrollToSlide on End keydown when at end', async () => {
    const scrollToSlide = vi.fn()

    const user = userEvent.setup()

    const { container } = render(
      <ImageSliderThumbnails {...defaultProps} currentSlideId={images.length - 1} scrollToSlide={scrollToSlide} />,
    )

    const component = container.querySelector(':only-child') as HTMLElement

    const lastThumbnail = component.children[images.length - 1] as HTMLElement
    lastThumbnail.focus()

    await user.keyboard('{End}')

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
