import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ZoomableImage } from './ZoomableImage'

const mockBoundingClientRect = (element: Element) => {
  vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
    bottom: 300,
    height: 200,
    left: 100,
    right: 500,
    toJSON: vi.fn(),
    top: 100,
    width: 400,
    x: 100,
    y: 100,
  })
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

    fireEvent.mouseMove(button, { clientX: 400, clientY: 250 })
    expect(image).toHaveStyle({ transformOrigin: '75% 75%' })
  })

  it('stops following the mouse at the edges of the image', () => {
    render(<ZoomableImage src="image.jpg" />)

    const button = screen.getByRole('button')
    const image = screen.getByRole('presentation')

    mockBoundingClientRect(button)

    fireEvent.click(button, { clientX: 300, clientY: 200, detail: 1 })
    fireEvent.mouseMove(button, { clientX: 0, clientY: 600 })

    expect(image).toHaveStyle({ transformOrigin: '0% 100%' })
  })

  it('does not follow the mouse when not zoomed in', () => {
    render(<ZoomableImage src="image.jpg" />)

    const button = screen.getByRole('button')

    mockBoundingClientRect(button)

    fireEvent.mouseMove(button, { clientX: 200, clientY: 150 })

    expect(screen.getByRole('presentation')).toHaveStyle({ transformOrigin: '50% 50%' })
  })
})
