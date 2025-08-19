import { renderHook } from '@testing-library/react'
import { RefObject } from 'react'

import { useSetFocusOnInvalidFormAlert } from './useSetFocusOnInvalidFormAlert'

describe('useSetFocusOnInvalidFormAlert', () => {
  it('calls focus on ref when errors are present', () => {
    const focus = vi.fn()
    const ref = { current: { focus } } as unknown as RefObject<HTMLDivElement>
    const errors = [{ key: 'foo', message: 'bar' }]

    renderHook(() => useSetFocusOnInvalidFormAlert(ref, errors))

    expect(focus).toHaveBeenCalled()
  })

  it('does not call focus if errors is undefined', () => {
    const focus = vi.fn()
    const ref = { current: { focus } } as unknown as RefObject<HTMLDivElement>

    renderHook(() => useSetFocusOnInvalidFormAlert(ref, undefined))

    expect(focus).not.toHaveBeenCalled()
  })
})
