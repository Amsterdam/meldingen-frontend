import type { UserEvent } from '@testing-library/user-event'

import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ZoomableImage } from './ZoomableImage'

// Renders the image in a button of 400 by 200 pixels, with its top left corner at 100, 100
const setup = () => {
  const user = userEvent.setup()

  render(<ZoomableImage src="image.jpg" />)

  const button = screen.getByRole('button')

  vi.spyOn(button, 'getBoundingClientRect').mockReturnValue(new DOMRect(100, 100, 400, 200))

  return { button, image: screen.getByRole('presentation'), user }
}

const clickAt = (user: UserEvent, target: Element, clientX: number, clientY: number) =>
  user.pointer({ coords: { clientX, clientY }, keys: '[MouseLeft]', target })

const moveMouseTo = (user: UserEvent, target: Element, clientX: number, clientY: number) =>
  user.pointer({ coords: { clientX, clientY }, target })

// Drags from the center of the button. A drag of 0, 0 is a tap.
const touchDrag = (user: UserEvent, target: Element, deltaX: number, deltaY: number) =>
  user.pointer([
    { coords: { clientX: 300, clientY: 200 }, keys: '[TouchA>]', target },
    { coords: { clientX: 300 + deltaX, clientY: 200 + deltaY }, pointerName: 'TouchA' },
    { keys: '[/TouchA]' },
  ])

// Renders the image zoomed in to 200% on the center
const setupZoomedIn = async () => {
  const result = setup()

  await clickAt(result.user, result.button, 300, 200)

  return result
}

describe('ZoomableImage', () => {
  it('renders an image in a button', () => {
    render(<ZoomableImage src="image.jpg" />)

    const button = screen.getByRole('button', { name: 'zoom-in' })
    const image = screen.getByRole('presentation')

    expect(button).toContainElement(image)
    expect(image).toHaveStyle({ transform: 'translate(0%, 0%) scale(1)' })
  })

  it('cycles through the zoom levels when clicked', async () => {
    const { button, image, user } = await setupZoomedIn()

    expect(image).toHaveStyle({ transform: 'translate(-50%, -50%) scale(2)' })
    expect(button).toHaveAccessibleName('zoom-in')

    await clickAt(user, button, 300, 200)
    expect(image).toHaveStyle({ transform: 'translate(-150%, -150%) scale(4)' })
    expect(button).toHaveAccessibleName('zoom-out')

    await clickAt(user, button, 300, 200)
    expect(image).toHaveStyle({ transform: 'translate(0%, 0%) scale(1)' })
  })

  it('zooms in on the center when activated with the keyboard', async () => {
    const { button, image, user } = setup()

    button.focus()
    await user.keyboard('{Enter}')

    expect(image).toHaveStyle({ transform: 'translate(-50%, -50%) scale(2)' })
  })

  it('follows the mouse when zoomed in', async () => {
    const { button, image, user } = setup()

    await clickAt(user, button, 200, 150)
    expect(image).toHaveStyle({ transform: 'translate(-25%, -25%) scale(2)' })

    await moveMouseTo(user, button, 400, 250)
    expect(image).toHaveStyle({ transform: 'translate(-75%, -75%) scale(2)' })
  })

  it('stops following the mouse at the edges of the image', async () => {
    const { button, image, user } = await setupZoomedIn()

    await moveMouseTo(user, button, 0, 600)

    expect(image).toHaveStyle({ transform: 'translate(0%, -100%) scale(2)' })
  })

  it('does not follow the mouse when not zoomed in', async () => {
    const { button, image, user } = setup()

    await moveMouseTo(user, button, 200, 150)

    expect(image).toHaveStyle({ transform: 'translate(0%, 0%) scale(1)' })
  })

  it('keeps the clicked part of the image in place when zooming in further', async () => {
    const { button, image, user } = await setupZoomedIn()

    // At 200% centered, the click at 80% / 20% of the button is on 65% / 35% of the image.
    // At 400%, that part of the image is shown at the same place with an offset of -180% / -120%.
    await clickAt(user, button, 420, 140)

    expect(image).toHaveStyle({ transform: 'translate(-180%, -120%) scale(4)' })
  })

  it('pans the image when dragging with touch, without changing the zoom level', async () => {
    const { button, image, user } = await setupZoomedIn()

    await touchDrag(user, button, 40, 20)

    expect(image).toHaveStyle({ transform: 'translate(-40%, -40%) scale(2)' })
  })

  it('stops panning at the edges of the image when dragging with touch', async () => {
    const { button, image, user } = await setupZoomedIn()

    await touchDrag(user, button, 1000, -1000)

    expect(image).toHaveStyle({ transform: 'translate(0%, -100%) scale(2)' })
  })

  it('does not pan when dragging with touch while not zoomed in', async () => {
    const { button, image, user } = setup()

    await touchDrag(user, button, 40, 20)

    expect(image).toHaveStyle({ transform: 'translate(0%, 0%) scale(1)' })
  })

  it('changes the zoom level once when tapping', async () => {
    const { button, user } = await setupZoomedIn()

    // A small movement is still a tap. The click after the tap should not change the zoom level again.
    await touchDrag(user, button, 2, 2)

    expect(button).toHaveAccessibleName('zoom-out')
  })

  it('changes the zoom level when tapping after dragging with touch', async () => {
    const { button, user } = await setupZoomedIn()

    await touchDrag(user, button, 40, 20)
    await touchDrag(user, button, 0, 0)

    expect(button).toHaveAccessibleName('zoom-out')
  })

  it('changes the zoom level with the keyboard after dragging with touch', async () => {
    const { button, user } = await setupZoomedIn()

    await touchDrag(user, button, 40, 20)

    button.focus()
    await user.keyboard('{Enter}')

    expect(button).toHaveAccessibleName('zoom-out')
  })

  it('ignores a cancelled touch, so a mouse click afterwards zooms in only once', async () => {
    const { button, image, user } = setup()

    // userEvent cannot cancel a pointer, which the browser does when it scrolls the image slider instead
    fireEvent.pointerDown(button, { clientX: 300, clientY: 200, pointerType: 'touch' })
    fireEvent.pointerCancel(button, { pointerType: 'touch' })

    await clickAt(user, button, 300, 200)

    expect(image).toHaveStyle({ transform: 'translate(-50%, -50%) scale(2)' })
  })

  it('does not pan when hovering with a pen', async () => {
    const { button, image } = await setupZoomedIn()

    // userEvent cannot hover a pen, it only moves a pen while it touches the screen
    fireEvent.pointerMove(button, { clientX: 340, clientY: 220, pointerType: 'pen' })

    expect(image).toHaveStyle({ transform: 'translate(-50%, -50%) scale(2)' })
  })

  it('pans the image with the arrow keys when zoomed in', async () => {
    const { button, image, user } = await setupZoomedIn()

    button.focus()

    await user.keyboard('{ArrowRight}{ArrowDown}{ArrowDown}')
    expect(image).toHaveStyle({ transform: 'translate(-60%, -70%) scale(2)' })

    await user.keyboard('{ArrowLeft}{ArrowLeft}{ArrowUp}')
    expect(image).toHaveStyle({ transform: 'translate(-40%, -60%) scale(2)' })
  })

  it('stops panning with the arrow keys at the edges of the image', async () => {
    const { button, image, user } = await setupZoomedIn()

    button.focus()

    await user.keyboard('{ArrowLeft>6/}{ArrowDown>6/}')

    expect(image).toHaveStyle({ transform: 'translate(0%, -100%) scale(2)' })
  })

  // userEvent does not tell whether the default action was prevented, so these tests use fireEvent
  it('does not pan with the arrow keys when not zoomed in', () => {
    const { button, image } = setup()

    const isNotPrevented = fireEvent.keyDown(button, { key: 'ArrowRight' })

    // The arrow key should still scroll the image slider
    expect(isNotPrevented).toBe(true)
    expect(image).toHaveStyle({ transform: 'translate(0%, 0%) scale(1)' })
  })

  it('prevents the image slider from scrolling when panning with the arrow keys', async () => {
    const { button } = await setupZoomedIn()

    const isNotPrevented = fireEvent.keyDown(button, { key: 'ArrowRight' })

    expect(isNotPrevented).toBe(false)
  })

  it('adds an `animating` class while zooming or panning with the keyboard', async () => {
    const { image } = await setupZoomedIn()

    expect(image.className).toMatch(/animating/)

    // userEvent cannot end a CSS transition
    fireEvent.transitionEnd(image)

    expect(image.className).not.toMatch(/animating/)
  })
})
