import { renderHook } from '@testing-library/react'

import { useDocumentTitleOnError } from './useDocumentTitleOnError'

describe('useDocumentTitleOnError', () => {
  beforeEach(() => {
    document.title = 'Report details'
  })

  it('preserves the document title when there are no errors', () => {
    renderHook(() => useDocumentTitleOnError({ hasApiError: false }))

    expect(document.title).toBe('Report details')
  })

  it('prefixes the document title when there is an API error', () => {
    renderHook(() => useDocumentTitleOnError({ hasApiError: true }))

    expect(document.title).toBe('api-error-alert.heading - Report details')
  })

  it('uses the given API error message instead of the default when provided', () => {
    renderHook(() =>
      useDocumentTitleOnError({
        apiErrorMessage: 'Custom error',
        hasApiError: true,
      }),
    )

    expect(document.title).toBe('Custom error - Report details')
  })

  it('preserves the document title when validationErrorCount is 0', () => {
    renderHook(() => useDocumentTitleOnError({ hasApiError: false, validationErrorCount: 0 }))

    expect(document.title).toBe('Report details')
  })

  it('prefixes the document title with the error count when validationErrorCount is > 0', () => {
    renderHook(() => useDocumentTitleOnError({ hasApiError: false, validationErrorCount: 3 }))

    expect(document.title).toBe('document-title-error-count-prefix Report details')
  })

  it('prioritizes validation errors over API errors and updates the prefix when they clear', () => {
    const { rerender } = renderHook(
      ({ validationErrorCount }) => useDocumentTitleOnError({ hasApiError: true, validationErrorCount }),
      { initialProps: { validationErrorCount: 1 } },
    )

    expect(document.title).toBe('document-title-error-count-prefix Report details')

    rerender({ validationErrorCount: 2 })

    expect(document.title).toBe('document-title-error-count-prefix Report details')

    rerender({ validationErrorCount: 0 })

    expect(document.title).toBe('api-error-alert.heading - Report details')
  })

  it('restores the original title when API errors are resolved', () => {
    const { rerender } = renderHook(({ hasApiError }) => useDocumentTitleOnError({ hasApiError }), {
      initialProps: { hasApiError: true },
    })

    expect(document.title).toBe('api-error-alert.heading - Report details')

    rerender({ hasApiError: false })

    expect(document.title).toBe('Report details')
  })

  it('replaces the error prefix without stacking it when it changes', () => {
    const { rerender } = renderHook(
      ({ apiErrorMessage }) => useDocumentTitleOnError({ apiErrorMessage, hasApiError: true }),
      { initialProps: { apiErrorMessage: 'First error' } },
    )

    expect(document.title).toBe('First error - Report details')

    rerender({ apiErrorMessage: 'First error' })

    expect(document.title).toBe('First error - Report details')

    rerender({ apiErrorMessage: 'Second error' })

    expect(document.title).toBe('Second error - Report details')
  })

  it('uses the current base title for the next error after errors clear', () => {
    const { rerender } = renderHook(({ hasApiError }) => useDocumentTitleOnError({ hasApiError }), {
      initialProps: { hasApiError: true },
    })

    rerender({ hasApiError: false })

    expect(document.title).toBe('Report details')

    document.title = 'Updated report details'

    rerender({ hasApiError: true })

    expect(document.title).toBe('api-error-alert.heading - Updated report details')
  })

  it('restores the original title when unmounted', () => {
    const { unmount } = renderHook(() => useDocumentTitleOnError({ hasApiError: true }))

    expect(document.title).toBe('api-error-alert.heading - Report details')

    unmount()

    expect(document.title).toBe('Report details')
  })

  it('does not overwrite a title set by navigation when unmounted', () => {
    const { unmount } = renderHook(() => useDocumentTitleOnError({ hasApiError: true }))

    document.title = 'Another page'

    unmount()

    expect(document.title).toBe('Another page')
  })
})
