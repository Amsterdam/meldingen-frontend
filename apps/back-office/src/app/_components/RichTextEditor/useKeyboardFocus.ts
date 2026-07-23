// Based on https://github.com/Amsterdam/design-system/blob/develop/packages/react/src/common/useKeyboardFocus.tsx

import type { KeyboardEvent, RefObject } from 'react'

const KeyboardKeys = {
  ArrowDown: 'ArrowDown',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
  ArrowUp: 'ArrowUp',
  End: 'End',
  Home: 'Home',
}

const FOCUSABLE_ELEMENTS = '.ams-icon-button:not([disabled])'

export const useKeyboardFocus = (ref: RefObject<HTMLElement>) => {
  const keyDown = (e: KeyboardEvent) => {
    if (!ref.current) return

    const element = ref.current
    const focusableEls: Array<Element> = Array.from(element.querySelectorAll(FOCUSABLE_ELEMENTS))
    const currentIndex = focusableEls.indexOf(document.activeElement as Element)

    let targetElement: Element | undefined

    switch (e.key) {
      case KeyboardKeys.ArrowDown:
      case KeyboardKeys.ArrowRight:
        targetElement = focusableEls[currentIndex + 1] || focusableEls[0]
        break
      case KeyboardKeys.ArrowLeft:
      case KeyboardKeys.ArrowUp:
        targetElement = focusableEls[currentIndex - 1] || focusableEls[focusableEls.length - 1]
        break
      case KeyboardKeys.End:
        targetElement = focusableEls[focusableEls.length - 1]
        break
      case KeyboardKeys.Home:
        targetElement = focusableEls[0]
        break
    }

    if (targetElement instanceof HTMLElement) {
      targetElement.focus()
      e.preventDefault()
    }
  }

  return { keyDown }
}
