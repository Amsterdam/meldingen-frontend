import type { RefObject } from 'react'

import { fireEvent, render, screen } from '@testing-library/react'
import { useRef } from 'react'
import { afterEach } from 'vitest'

import { useKeyboardFocus } from './useKeyboardFocus'

describe('useKeyboardFocus', () => {
  const onFocusOneMock = vi.fn()
  const onFocusTwoMock = vi.fn()
  const onFocusThreeMock = vi.fn()

  const Component = () => {
    const ref = useRef<HTMLDivElement>(null)
    const { keyDown } = useKeyboardFocus(ref as RefObject<HTMLDivElement>)

    return (
      <div onKeyDown={keyDown} ref={ref} role="menu" tabIndex={0}>
        <button className="ams-icon-button" onFocus={onFocusOneMock} type="button">
          One
        </button>
        <button className="ams-icon-button" onFocus={onFocusTwoMock} type="button">
          Two
        </button>
        <button className="ams-icon-button" onFocus={onFocusThreeMock} type="button">
          Three
        </button>
      </div>
    )
  }

  afterEach(() => {
    onFocusOneMock.mockReset()
    onFocusTwoMock.mockReset()
    onFocusThreeMock.mockReset()
  })

  it('sets focus when using "ArrowDown" and "ArrowUp" keys', () => {
    const { container } = render(<Component />)

    const firstChild = container.firstChild as HTMLElement

    expect(onFocusOneMock).not.toHaveBeenCalled()

    fireEvent.keyDown(firstChild, { key: 'ArrowDown' })
    expect(onFocusOneMock).toHaveBeenCalledTimes(1)

    fireEvent.keyDown(firstChild, { key: 'ArrowDown' })
    expect(onFocusTwoMock).toHaveBeenCalledTimes(1)

    fireEvent.keyDown(firstChild, { key: 'ArrowDown' })
    expect(onFocusThreeMock).toHaveBeenCalledTimes(1)

    fireEvent.keyDown(firstChild, { key: 'ArrowUp' })
    expect(onFocusTwoMock).toHaveBeenCalledTimes(2)

    fireEvent.keyDown(firstChild, { key: 'ArrowUp' })
    expect(onFocusOneMock).toHaveBeenCalledTimes(2)
  })

  it('sets focus when using "ArrowRight" and "ArrowLeft" keys', () => {
    const { container } = render(<Component />)

    const firstChild = container.firstChild as HTMLElement

    fireEvent.keyDown(firstChild, { key: 'ArrowRight' })
    expect(onFocusOneMock).toHaveBeenCalledTimes(1)

    fireEvent.keyDown(firstChild, { key: 'ArrowRight' })
    expect(onFocusTwoMock).toHaveBeenCalledTimes(1)

    fireEvent.keyDown(firstChild, { key: 'ArrowLeft' })
    expect(onFocusOneMock).toHaveBeenCalledTimes(2)
  })

  it('rotates focused elements', () => {
    const { container } = render(<Component />)

    const firstChild = container.firstChild as HTMLElement

    Array.from(Array(9).keys()).forEach(() => {
      fireEvent.keyDown(firstChild, { key: 'ArrowDown' })
    })

    expect(onFocusOneMock).toHaveBeenCalledTimes(3)

    Array.from(Array(9).keys()).forEach(() => {
      fireEvent.keyDown(firstChild, { key: 'ArrowUp' })
    })

    expect(onFocusOneMock).toHaveBeenCalledTimes(6)
  })

  it('sets focus to first element when using "Home" key', () => {
    const { container } = render(<Component />)

    const firstChild = container.firstChild as HTMLElement

    fireEvent.keyDown(firstChild, { key: 'Home' })

    expect(onFocusOneMock).toHaveBeenCalledTimes(1)
  })

  it('sets focus to last element when using "End" key', () => {
    const { container } = render(<Component />)

    const firstChild = container.firstChild as HTMLElement

    fireEvent.keyDown(firstChild, {
      key: 'End',
    })

    expect(onFocusThreeMock).toHaveBeenCalledTimes(1)
  })

  it('does nothing when ref.current is null', () => {
    const NullRefComponent = () => {
      const ref = useRef<HTMLDivElement>(null)
      const { keyDown } = useKeyboardFocus(ref as RefObject<HTMLDivElement>)
      // ref is intentionally not attached to any element so ref.current stays null
      return <div onKeyDown={keyDown} role="menu" tabIndex={0} />
    }

    render(<NullRefComponent />)

    const component = screen.getByRole('menu')

    fireEvent.keyDown(component, { key: 'ArrowDown' })
    // Should return early without focusing anything
    expect(onFocusOneMock).not.toHaveBeenCalled()
  })

  it('does nothing when an unhandled key is pressed', () => {
    const { container } = render(<Component />)

    const firstChild = container.firstChild as HTMLElement

    fireEvent.keyDown(firstChild, { key: 'a' })

    expect(onFocusOneMock).not.toHaveBeenCalled()
    expect(onFocusTwoMock).not.toHaveBeenCalled()
    expect(onFocusThreeMock).not.toHaveBeenCalled()
  })
})
