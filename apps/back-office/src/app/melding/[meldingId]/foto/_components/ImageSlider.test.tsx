import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { formatDateTime, ImageSlider } from './ImageSlider'

// All functionality that relies on IntersectionObserver, like setting aria-hidden and showing an image
// by clicking on the thumbnail button, cannot be properly tested here because IntersectionObserver is not implemented in JSDom.
// These tests are mostly covered by the Amsterdam Design System.

// Mock implementation of IntersectionObserver
// eslint-disable-next-line prefer-arrow-functions/prefer-arrow-functions
window.IntersectionObserver = vi.fn(function IntersectionObserver() {
  return {
    disconnect: vi.fn(),
    observe: vi.fn(),
    root: null,
    rootMargin: '',
    scrollMargin: '',
    takeRecords: vi.fn(),
    thresholds: [],
    unobserve: vi.fn(),
  }
})

const scrollIntoView = vi.fn()

// Mock scrollIntoView, which scrollToSlide uses to bring the current slide into view
Element.prototype.scrollIntoView = scrollIntoView

const defaultProps = {
  images: [
    {
      createdAt: '2024-06-01T00:00:00.000Z',
      data: new Blob(),
      filename: 'image-1.jpg',
      id: 1,
    },
    {
      createdAt: '2024-08-01T00:00:00.000Z',
      data: new Blob(),
      filename: 'image-2.jpg',
      id: 2,
    },
    {
      createdAt: '2024-09-01T00:00:00.000Z',
      data: new Blob(),
      filename: 'image-3.jpg',
      id: 3,
    },
  ],
  labelId: 'test-label-id',
}

describe('ImageSlider', () => {
  it('renders', () => {
    render(<ImageSlider {...defaultProps} />)

    const component = screen.getByRole('region')

    expect(component).toBeInTheDocument()
  })

  it('scrolls to the default slide instantly on mount when defaultSlideIndex is provided', () => {
    render(<ImageSlider {...defaultProps} defaultSlideIndex={2} />)

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'instant', block: 'nearest', inline: 'center' })
  })

  it('scrolls to the next image when clicking the next button', async () => {
    const user = userEvent.setup()

    const { getByRole } = render(<ImageSlider {...defaultProps} />)

    const nextButton = getByRole('button', { name: 'next' })
    const previousButton = getByRole('button', { name: 'previous' })

    // At the start, previous button is disabled
    expect(previousButton).toBeDisabled()
    expect(nextButton).not.toBeDisabled()

    expect(scrollIntoView).not.toHaveBeenCalled()

    await user.click(nextButton)
    await user.click(nextButton)

    expect(scrollIntoView).toHaveBeenCalledTimes(2)
  })

  it('scrolls to the previous image when clicking the previous button', async () => {
    const user = userEvent.setup()

    const { getByRole } = render(<ImageSlider {...defaultProps} />)

    const nextButton = getByRole('button', { name: 'next' })
    const previousButton = getByRole('button', { name: 'previous' })

    // At the start, previous button is disabled
    expect(previousButton).toBeDisabled()
    expect(nextButton).not.toBeDisabled()

    await user.click(nextButton)
    await user.click(nextButton)

    expect(scrollIntoView).toHaveBeenCalledTimes(2)

    await user.click(previousButton)
    await user.click(previousButton)

    expect(scrollIntoView).toHaveBeenCalledTimes(4)
  })

  it('renders thumbnails', () => {
    render(<ImageSlider {...defaultProps} />)

    const thumbnail1 = screen.getByRole('tab', { name: 'thumbnail-button-prefix 1' })
    const thumbnail2 = screen.getByRole('tab', { name: 'thumbnail-button-prefix 2' })
    const thumbnail3 = screen.getByRole('tab', { name: 'thumbnail-button-prefix 3' })

    expect(thumbnail1).toBeInTheDocument()
    expect(thumbnail2).toBeInTheDocument()
    expect(thumbnail3).toBeInTheDocument()
  })

  it('does not render anything if there are no images', () => {
    const { container } = render(<ImageSlider images={[]} labelId="test-label-id" />)

    expect(container).toBeEmptyDOMElement()
  })

  it('calls scrollToSlide when a thumbnail is clicked', async () => {
    scrollIntoView.mockClear()
    const user = userEvent.setup()

    const { getAllByRole } = render(<ImageSlider {...defaultProps} />)

    const thumbnails = getAllByRole('tab')

    const scrollIntoViewCallCountAfterRender = scrollIntoView.mock.calls.length

    await user.click(thumbnails[1])

    expect(scrollIntoView).toHaveBeenCalledTimes(scrollIntoViewCallCountAfterRender + 1)
  })

  it('disables the next button when the last image is reached', async () => {
    const user = userEvent.setup()

    const { getByRole } = render(<ImageSlider {...defaultProps} />)

    const nextButton = getByRole('button', { name: 'next' })
    const previousButton = getByRole('button', { name: 'previous' })

    await user.click(nextButton)
    await user.click(nextButton)

    expect(nextButton).toBeDisabled()
    expect(previousButton).not.toBeDisabled()
  })

  it('renders the filename and formatted date in the caption of each slide', () => {
    render(<ImageSlider {...defaultProps} />)

    expect(screen.getByText('image-1.jpg')).toBeInTheDocument()
    expect(screen.getByText('image-2.jpg')).toBeInTheDocument()
    expect(screen.getByText('image-3.jpg')).toBeInTheDocument()

    expect(screen.getByText(formatDateTime(defaultProps.images[0].createdAt))).toBeInTheDocument()
    expect(screen.getByText(formatDateTime(defaultProps.images[1].createdAt))).toBeInTheDocument()
    expect(screen.getByText(formatDateTime(defaultProps.images[2].createdAt))).toBeInTheDocument()
  })

  it('marks the current thumbnail as selected and updates it when navigating', async () => {
    const user = userEvent.setup()

    const { getAllByRole } = render(<ImageSlider {...defaultProps} />)

    const nextButton = getAllByRole('button', { name: 'next' })[0]
    const thumbnails = getAllByRole('tab')

    expect(thumbnails[0]).toHaveAttribute('aria-selected', 'true')
    expect(thumbnails[1]).toHaveAttribute('aria-selected', 'false')
    expect(thumbnails[2]).toHaveAttribute('aria-selected', 'false')

    await user.click(nextButton)

    expect(thumbnails[0]).toHaveAttribute('aria-selected', 'false')
    expect(thumbnails[1]).toHaveAttribute('aria-selected', 'true')
    expect(thumbnails[2]).toHaveAttribute('aria-selected', 'false')

    await user.click(thumbnails[2])

    expect(thumbnails[0]).toHaveAttribute('aria-selected', 'false')
    expect(thumbnails[1]).toHaveAttribute('aria-selected', 'false')
    expect(thumbnails[2]).toHaveAttribute('aria-selected', 'true')
  })
})
