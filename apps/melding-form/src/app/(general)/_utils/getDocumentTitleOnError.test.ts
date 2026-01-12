import { getDocumentTitleOnError } from './getDocumentTitleOnError'

describe('getDocumentTitleOnError', () => {
  const originalDocTitle = 'Test title'
  const t = (key: string, options?: { count: number }) => (options?.count ? `(${options?.count ?? 0} errors)` : key)

  it('returns original title when there are no errors', () => {
    const title = getDocumentTitleOnError({
      originalDocTitle,
      translateFunction: t,
    })

    expect(title).toBe(originalDocTitle)
  })

  it('returns system error title and original title when there is a system error', () => {
    const title = getDocumentTitleOnError({
      hasSystemError: true,
      originalDocTitle,
      translateFunction: t,
    })

    expect(title).toBe('system-error-alert-title - Test title')
  })

  it('returns original title when validationErrorCount is 0', () => {
    const title = getDocumentTitleOnError({
      originalDocTitle,
      translateFunction: t,
      validationErrorCount: 0,
    })

    expect(title).toBe(originalDocTitle)
  })

  it('returns error count label and original title when validationErrorCount is > 0', () => {
    const title = getDocumentTitleOnError({
      originalDocTitle,
      translateFunction: t,
      validationErrorCount: 3,
    })

    expect(title).toBe('(3 errors) Test title')
  })
})
