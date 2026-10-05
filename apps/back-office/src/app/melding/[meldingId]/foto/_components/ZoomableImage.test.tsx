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
  fireEvent.pointerUp(element, { clientX: 300 + deltaX, clientY: 200 + deltaY, pointerType: 'touch' })
}

describe('ZoomableImage', () => {
  it('renders an image in a button', () => {
    render(<ZoomableImage src="image.jpg" />)

    const button = screen.getByRole('button', { name: 'zoom-in' })
    const image = screen.getByRole('presentation')

    expect(button).toContainElement(image)
    expect(image).toHaveStyle({ transform: 'translate(0%, 0%) scale(1)' })
  })

  it('cycles through the zoom levels when clicked', () => {
    const { button, image } = renderZoomedIn()

    expect(image).toHaveStyle({ transform: 'translate(-50%, -50%) scale(2)' })
    expect(button).toHaveAccessibleName('zoom-in')

    fireEvent.click(button, { clientX: 300, clientY: 200, detail: 1 })
    expect(image).toHaveStyle({ transform: 'translate(-150%, -150%) scale(4)' })
    expect(button).toHaveAccessibleName('zoom-out')

    fireEvent.click(button, { clientX: 300, clientY: 200, detail: 1 })
    expect(image).toHaveStyle({ transform: 'translate(0%, 0%) scale(1)' })
  })

  it('zooms in on the center when activated with the keyboard', async () => {
    const user = userEvent.setup()

    render(<ZoomableImage src="image.jpg" />)

    screen.getByRole('button').focus()
    await user.keyboard('{Enter}')

    expect(screen.getByRole('presentation')).toHaveStyle({ transform: 'translate(-50%, -50%) scale(2)' })
  })

  it('follows the mouse when zoomed in', () => {
    render(<ZoomableImage src="image.jpg" />)

    const button = screen.getByRole('button')
    const image = screen.getByRole('presentation')

    mockBoundingClientRect(button)

    fireEvent.click(button, { clientX: 200, clientY: 150, detail: 1 })
    expect(image).toHaveStyle({ transform: 'translate(-25%, -25%) scale(2)' })

    fireEvent.pointerMove(button, { clientX: 400, clientY: 250, pointerType: 'mouse' })
    expect(image).toHaveStyle({ transform: 'translate(-75%, -75%) scale(2)' })
  })

  it('stops following the mouse at the edges of the image', () => {
    render(<ZoomableImage src="image.jpg" />)

    const button = screen.getByRole('button')
    const image = screen.getByRole('presentation')

    mockBoundingClientRect(button)

    fireEvent.click(button, { clientX: 300, clientY: 200, detail: 1 })
    fireEvent.pointerMove(button, { clientX: 0, clientY: 600, pointerType: 'mouse' })

    expect(image).toHaveStyle({ transform: 'translate(0%, -100%) scale(2)' })
  })

  it('does not follow the mouse when not zoomed in', () => {
    render(<ZoomableImage src="image.jpg" />)

    const button = screen.getByRole('button')

    mockBoundingClientRect(button)

    fireEvent.pointerMove(button, { clientX: 200, clientY: 150, pointerType: 'mouse' })

    expect(screen.getByRole('presentation')).toHaveStyle({ transform: 'translate(0%, 0%) scale(1)' })
  })

  it('pans the image when dragging with touch', () => {
    const { button, image } = renderZoomedIn()

    touchDrag(button, 40, 20)

    expect(image).toHaveStyle({ transform: 'translate(-40%, -40%) scale(2)' })
  })

  it('keeps the tapped part of the image in place when zooming in further', () => {
    const { button, image } = renderZoomedIn()

    // At 200% centered, the tap at 80% / 20% of the button is on 65% / 35% of the image.
    // At 400%, that part of the image is shown at the same place with an offset of -180% / -120%.
    fireEvent.click(button, { clientX: 420, clientY: 140, detail: 1 })

    expect(image).toHaveStyle({ transform: 'translate(-180%, -120%) scale(4)' })
  })

  it('stops panning at the edges of the image when dragging with touch', () => {
    const { button, image } = renderZoomedIn()

    touchDrag(button, 1000, -1000)

    expect(image).toHaveStyle({ transform: 'translate(0%, -100%) scale(2)' })
  })

  it('does not change the zoom level after dragging with touch', () => {
    const { button, image } = renderZoomedIn()

    touchDrag(button, 40, 20)
    fireEvent.click(button, { clientX: 340, clientY: 220, detail: 1 })

    expect(image).toHaveStyle({ transform: 'translate(-40%, -40%) scale(2)' })
  })

  it('changes the zoom level when tapping without dragging', () => {
    const { button } = renderZoomedIn()

    touchDrag(button, 2, 2)

    expect(button).toHaveAccessibleName('zoom-out')

    // The click the browser fires after the tap should not change the zoom level again
    fireEvent.click(button, { clientX: 302, clientY: 202, detail: 1 })

    expect(button).toHaveAccessibleName('zoom-out')
  })

  it('changes the zoom level when tapping after dragging with touch', () => {
    const { button } = renderZoomedIn()

    touchDrag(button, 40, 20)
    touchDrag(button, 0, 0)

    expect(button).toHaveAccessibleName('zoom-out')
  })

  it('changes the zoom level with the keyboard after dragging with touch', () => {
    const { button } = renderZoomedIn()

    touchDrag(button, 40, 20)
    fireEvent.click(button, { detail: 0 })

    expect(button).toHaveAccessibleName('zoom-out')
  })

  it('does not pan when dragging with touch while not zoomed in', () => {
    render(<ZoomableImage src="image.jpg" />)

    const button = screen.getByRole('button')

    mockBoundingClientRect(button)
    touchDrag(button, 40, 20)

    expect(screen.getByRole('presentation')).toHaveStyle({ transform: 'translate(0%, 0%) scale(1)' })
  })

  it('only animates the image while zooming or panning with the keyboard', () => {
    const { image } = renderZoomedIn()

    expect(image.className).toMatch(/animating/)

    fireEvent.transitionEnd(image)

    expect(image.className).not.toMatch(/animating/)
  })

  it('pans the image with the arrow keys when zoomed in', async () => {
    const user = userEvent.setup()
    const { image } = renderZoomedIn()

    screen.getByRole('button').focus()

    await user.keyboard('{ArrowRight}{ArrowDown}{ArrowDown}')
    expect(image).toHaveStyle({ transform: 'translate(-60%, -70%) scale(2)' })

    await user.keyboard('{ArrowLeft}{ArrowLeft}{ArrowUp}')
    expect(image).toHaveStyle({ transform: 'translate(-40%, -60%) scale(2)' })
  })

  it('stops panning with the arrow keys at the edges of the image', async () => {
    const user = userEvent.setup()
    const { image } = renderZoomedIn()

    screen.getByRole('button').focus()

    await user.keyboard('{ArrowLeft>6/}{ArrowDown>6/}')

    expect(image).toHaveStyle({ transform: 'translate(0%, -100%) scale(2)' })
  })

  it('does not pan with the arrow keys when not zoomed in', () => {
    render(<ZoomableImage src="image.jpg" />)

    const button = screen.getByRole('button')
    const isNotPrevented = fireEvent.keyDown(button, { key: 'ArrowRight' })

    // The arrow key should still scroll the image slider
    expect(isNotPrevented).toBe(true)
    expect(screen.getByRole('presentation')).toHaveStyle({ transform: 'translate(0%, 0%) scale(1)' })
  })

  it('prevents the image slider from scrolling when panning with the arrow keys', () => {
    const { button } = renderZoomedIn()

    const isNotPrevented = fireEvent.keyDown(button, { key: 'ArrowRight' })

    expect(isNotPrevented).toBe(false)
  })

  it('ignores a cancelled touch, so a mouse click afterwards zooms in only once', () => {
    render(<ZoomableImage src="image.jpg" />)

    const button = screen.getByRole('button')

    mockBoundingClientRect(button)

    // The browser cancels the touch when it scrolls the image slider instead
    fireEvent.pointerDown(button, { clientX: 300, clientY: 200, pointerType: 'touch' })
    fireEvent.pointerCancel(button, { pointerType: 'touch' })

    fireEvent.pointerDown(button, { clientX: 300, clientY: 200, pointerType: 'mouse' })
    fireEvent.pointerUp(button, { clientX: 300, clientY: 200, pointerType: 'mouse' })
    fireEvent.click(button, { clientX: 300, clientY: 200, detail: 1 })

    expect(screen.getByRole('presentation')).toHaveStyle({ transform: 'translate(-50%, -50%) scale(2)' })
  })
})
