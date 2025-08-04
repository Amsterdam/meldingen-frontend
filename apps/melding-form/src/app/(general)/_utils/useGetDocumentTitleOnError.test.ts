import { renderHook } from '@testing-library/react'

import { useGetDocumentTitleOnError } from './useGetDocumentTitleOnError'

describe('useGetDocumentTitleOnError', () => {
  const originalDocTitle = 'Test title'
  const t = (_: string, { count }: { count: number }) => `(${count} errors)`

  it('returns original title when no validationErrors', () => {
    const { result } = renderHook(() => useGetDocumentTitleOnError(originalDocTitle, t, undefined))

    expect(result.current).toBe(originalDocTitle)
  })

  it('returns error count label and original title when validationErrors are present', () => {
    const validationErrors = [
      { key: 'a', message: 'Error A' },
      { key: 'b', message: 'Error B' },
      { key: 'c', message: 'Error C' },
    ] // 3 errors

    const { result } = renderHook(() => useGetDocumentTitleOnError(originalDocTitle, t, validationErrors))

    expect(result.current).toBe('(3 errors) Test title')
  })
})
