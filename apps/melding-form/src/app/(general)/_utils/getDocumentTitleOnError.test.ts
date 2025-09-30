import { getDocumentTitleOnError } from './getDocumentTitleOnError'

describe('getDocumentTitleOnError', () => {
  const originalDocTitle = 'Test title'
  const t = (_: string, { count }: { count: number }) => `(${count} errors)`

  it('returns original title when there are no validationErrors', () => {
    const title = getDocumentTitleOnError(originalDocTitle, t, undefined)

    expect(title).toBe(originalDocTitle)
  })

  it('returns original title when validationErrors is an empty array', () => {
    const title = getDocumentTitleOnError(originalDocTitle, t, [])

    expect(title).toBe(originalDocTitle)
  })

  it('returns error count label and original title when validationErrors are present', () => {
    const validationErrors = [
      { key: 'a', message: 'Error A' },
      { key: 'b', message: 'Error B' },
      { key: 'c', message: 'Error C' },
    ] // 3 errors

    const title = getDocumentTitleOnError(originalDocTitle, t, validationErrors)

    expect(title).toBe('(3 errors) Test title')
  })
})
