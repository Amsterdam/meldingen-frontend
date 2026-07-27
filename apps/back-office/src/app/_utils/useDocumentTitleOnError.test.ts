import { useDocumentTitleOnError } from './useDocumentTitleOnError'

describe('useDocumentTitleOnError', () => {
  const baseDocumentTitle = 'Test title'

  it('returns original title when there are no errors', () => {
    const title = useDocumentTitleOnError({ baseDocumentTitle })

    expect(title).toBe(baseDocumentTitle)
  })

  it('returns API error title and original title when there is an API error', () => {
    const title = useDocumentTitleOnError({ baseDocumentTitle, hasApiError: true })

    expect(title).toBe(`api-error-alert.heading - ${baseDocumentTitle}`)
  })

  it('returns the given API error message instead of the default when provided', () => {
    const title = useDocumentTitleOnError({
      apiErrorMessage: 'Custom error',
      baseDocumentTitle,
      hasApiError: true,
    })

    expect(title).toBe(`Custom error - ${baseDocumentTitle}`)
  })

  it('returns original title when validationErrorCount is 0', () => {
    const title = useDocumentTitleOnError({ baseDocumentTitle, validationErrorCount: 0 })

    expect(title).toBe(baseDocumentTitle)
  })

  it('returns error count label and original title when validationErrorCount is > 0', () => {
    const title = useDocumentTitleOnError({ baseDocumentTitle, validationErrorCount: 3 })

    expect(title).toBe(`document-title-error-count-prefix ${baseDocumentTitle}`)
  })
})
