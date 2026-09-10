import { render, screen } from '@testing-library/react'

import { Photos } from './Photos'

const imageSliderMock = vi.fn((_props: unknown) => <div data-testid="image-slider" />)

vi.mock('./_components/ImageSlider', () => ({
  ImageSlider: (props: unknown) => imageSliderMock(props),
}))

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
  ],
  meldingId: 123,
}

describe('Photos', () => {
  it('renders the back link with the correct href', () => {
    render(<Photos {...defaultProps} />)

    const backLink = screen.getByRole('link', { name: 'back-link' })

    expect(backLink).toHaveAttribute('href', '/melding/123')
  })

  it('renders the title as a heading', () => {
    render(<Photos {...defaultProps} />)

    const heading = screen.getByRole('heading', { level: 1, name: 'title' })

    expect(heading).toBeInTheDocument()
    expect(heading).toHaveAttribute('id', 'heading')
  })

  it('passes the given images and the heading id as labelId to ImageSlider', () => {
    render(<Photos {...defaultProps} />)

    expect(imageSliderMock).toHaveBeenCalledWith({
      defaultSlideIndex: undefined,
      images: defaultProps.images,
      labelId: 'heading',
    })
  })

  it('passes defaultSlideIndex to ImageSlider when provided', () => {
    render(<Photos {...defaultProps} defaultSlideIndex={1} />)

    expect(imageSliderMock).toHaveBeenCalledWith({
      defaultSlideIndex: 1,
      images: defaultProps.images,
      labelId: 'heading',
    })
  })
})
