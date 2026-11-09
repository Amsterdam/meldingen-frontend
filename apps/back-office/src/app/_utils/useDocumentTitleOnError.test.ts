import { renderHook } from '@testing-library/react'

import { useDocumentTitleOnError } from './useDocumentTitleOnError'

describe('useDocumentTitleOnError', () => {
  const baseDocumentTitle = 'Test title'

  beforeEach(() => {
    document.title = baseDocumentTitle
  })

  it('returns no override when there are no errors', () => {
    const { result } = renderHook(() => useDocumentTitleOnError({ hasApiError: false }))

    expect(result.current).toBeUndefined()
  })

  it('returns API error title and original title when there is an API error', () => {
    const { result } = renderHook(() => useDocumentTitleOnError({ hasApiError: true }))

    expect(result.current).toBe(`api-error-alert.heading - ${baseDocumentTitle}`)
  })

  it('returns the given API error message instead of the default when provided', () => {
    const { result } = renderHook(() =>
      useDocumentTitleOnError({
        apiErrorMessage: 'Custom error',
        hasApiError: true,
      }),
    )

    expect(result.current).toBe(`Custom error - ${baseDocumentTitle}`)
  })

  it('returns no override when validationErrorCount is 0', () => {
    const { result } = renderHook(() => useDocumentTitleOnError({ hasApiError: false, validationErrorCount: 0 }))

    expect(result.current).toBeUndefined()
  })

  it('returns error count label and original title when validationErrorCount is > 0', () => {
    const { result } = renderHook(() => useDocumentTitleOnError({ hasApiError: false, validationErrorCount: 3 }))

    expect(result.current).toBe(`document-title-error-count-prefix ${baseDocumentTitle}`)
  })

  it('does not stack prefixes when errors change across renders', () => {
    const { rerender, result } = renderHook(
      ({ validationErrorCount }) => useDocumentTitleOnError({ hasApiError: true, validationErrorCount }),
      { initialProps: { validationErrorCount: 1 } },
    )

    expect(result.current).toBe(`document-title-error-count-prefix ${baseDocumentTitle}`)
    document.title = `document-title-error-count-prefix ${baseDocumentTitle}`

    rerender({ validationErrorCount: 2 })

    expect(result.current).toBe(`document-title-error-count-prefix ${baseDocumentTitle}`)

    rerender({ validationErrorCount: 0 })

    expect(result.current).toBe(`api-error-alert.heading - ${baseDocumentTitle}`)
  })

  it('uses the current base title for a new error after previous errors are resolved', () => {
    const { rerender, result } = renderHook(({ hasApiError }) => useDocumentTitleOnError({ hasApiError }), {
      initialProps: { hasApiError: true },
    })

    expect(result.current).toBe(`api-error-alert.heading - ${baseDocumentTitle}`)

    rerender({ hasApiError: false })

    expect(result.current).toBeUndefined()
    document.title = 'New title'

    rerender({ hasApiError: true })

    expect(result.current).toBe('api-error-alert.heading - New title')
  })
})
