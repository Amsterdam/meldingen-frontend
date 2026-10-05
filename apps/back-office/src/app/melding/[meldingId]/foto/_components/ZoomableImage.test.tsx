import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ZoomableImage } from './ZoomableImage'

const mockBoundingClientRect = (element: Element) => {
  vi.spyOn(element, 'getBoundingClientRect').mockReturnValue(new DOMRect(100, 100, 400, 200))
}

// Renders the image zoomed in to 200% on the center
const renderZoomedIn = () => {
  render(<ZoomableImage src="image.jpg" />)

  const button = screen.getByRole('button')

  mockBoundingClientRect(button)
  fireEvent.click(button, { clientX: 300, clientY: 200, detail: 1 })

  return { button, image: screen.getByRole('presentation') }
}

const touchDrag = (element: Element, deltaX: number, deltaY: number) => {
  fireEvent.pointerDown(element, { clientX: 300, clientY: 200, pointerType: 'touch' })
  fireEvent.pointerMove(element, { clientX: 300 + deltaX, clientY: 200 + deltaY, pointerType: 'touch' })
  fireEvent.pointerUp(element, { pointerType: 'touch' })
}

describe('ZoomableImage', () => {
  it('renders an image in a button', () => {
    render(<ZoomableImage src="image.jpg" />)

    const button = screen.getByRole('button', { name: 'zoom-in' })
    const image = screen.getByRole('presentation')

    expect(button).toContainElement(image)
    expect(image).toHaveStyle({ transform: 'scale(1)' })
  })

  it('cycles through the zoom levels when clicked', async () => {
    const user = userEvent.setup()

    render(<ZoomableImage src="image.jpg" />)

    const button = screen.getByRole('button')
    const image = screen.getByRole('presentation')

    await user.click(button)
    expect(image).toHaveStyle({ transform: 'scale(2)' })
    expect(button).toHaveAccessibleName('zoom-in')

    await user.click(button)
    expect(image).toHaveStyle({ transform: 'scale(4)' })
    expect(button).toHaveAccessibleName('zoom-out')

    await user.click(button)
    expect(image).toHaveStyle({ transform: 'scale(1)' })
  })

  it('zooms in on the center when activated with the keyboard', async () => {
    const user = userEvent.setup()

    render(<ZoomableImage src="image.jpg" />)

    screen.getByRole('button').focus()
    await user.keyboard('{Enter}')

    expect(screen.getByRole('presentation')).toHaveStyle({ transform: 'scale(2)', transformOrigin: '50% 50%' })
  })

  it('follows the mouse when zoomed in', () => {
    render(<ZoomableImage src="image.jpg" />)

    const button = screen.getByRole('button')
    const image = screen.getByRole('presentation')

    mockBoundingClientRect(button)

    fireEvent.click(button, { clientX: 200, clientY: 150, detail: 1 })
    expect(image).toHaveStyle({ transformOrigin: '25% 25%' })

    fireEvent.pointerMove(button, { clientX: 400, clientY: 250, pointerType: 'mouse' })
    expect(image).toHaveStyle({ transformOrigin: '75% 75%' })
  })

  it('stops following the mouse at the edges of the image', () => {
    render(<ZoomableImage src="image.jpg" />)

    const button = screen.getByRole('button')
    const image = screen.getByRole('presentation')

    mockBoundingClientRect(button)

    fireEvent.click(button, { clientX: 300, clientY: 200, detail: 1 })
    fireEvent.pointerMove(button, { clientX: 0, clientY: 600, pointerType: 'mouse' })

    expect(image).toHaveStyle({ transformOrigin: '0% 100%' })
  })

  it('does not follow the mouse when not zoomed in', () => {
    render(<ZoomableImage src="image.jpg" />)

    const button = screen.getByRole('button')

    mockBoundingClientRect(button)

    fireEvent.pointerMove(button, { clientX: 200, clientY: 150, pointerType: 'mouse' })

    expect(screen.getByRole('presentation')).toHaveStyle({ transformOrigin: '50% 50%' })
  })

  it('pans the image when dragging with touch', () => {
    const { button, image } = renderZoomedIn()

    touchDrag(button, 40, 20)

    expect(image).toHaveStyle({ transformOrigin: '40% 40%' })
  })

  it('keeps the tapped part of the image in place when zooming in further', () => {
    const { button, image } = renderZoomedIn()

    // At 200% with the origin in the center, the tap at 80% / 20% of the button shows the image at 65% / 35%.
    // Zooming to 400% with the origin at 60% / 40% shows that same part of the image under the tap.
    fireEvent.click(button, { clientX: 420, clientY: 140, detail: 1 })

    expect(image).toHaveStyle({ transform: 'scale(4)', transformOrigin: '60% 40%' })
  })

  it('stops panning at the edges of the image when dragging with touch', () => {
    const { button, image } = renderZoomedIn()

    touchDrag(button, 1000, -1000)

    expect(image).toHaveStyle({ transformOrigin: '0% 100%' })
  })

  it('does not change the zoom level after dragging with touch', () => {
    const { button, image } = renderZoomedIn()

    touchDrag(button, 40, 20)
    fireEvent.click(button, { clientX: 340, clientY: 220, detail: 1 })

    expect(image).toHaveStyle({ transform: 'scale(2)' })
  })

  it('changes the zoom level when tapping without dragging', () => {
    const { button, image } = renderZoomedIn()

    touchDrag(button, 2, 2)
    fireEvent.click(button, { clientX: 302, clientY: 202, detail: 1 })

    expect(image).toHaveStyle({ transform: 'scale(4)' })
  })

  it('changes the zoom level with the keyboard after dragging with touch', () => {
    const { button, image } = renderZoomedIn()

    touchDrag(button, 40, 20)
    fireEvent.click(button, { detail: 0 })

    expect(image).toHaveStyle({ transform: 'scale(4)' })
  })

  it('does not pan when dragging with touch while not zoomed in', () => {
    render(<ZoomableImage src="image.jpg" />)

    const button = screen.getByRole('button')

    mockBoundingClientRect(button)
    touchDrag(button, 40, 20)

    expect(screen.getByRole('presentation')).toHaveStyle({ transformOrigin: '50% 50%' })
  })
})
