import { buildAnswerPromises } from './buildAnswerPromises'

describe('buildAnswerPromises', () => {
  it('returns an array with undefined when the answer is an empty string', () => {
    const emptyEntry: [string, string] = ['key1', '']
    const questionKeysAndIds = [{ key: 'key1', id: 1 }]

    const result = buildAnswerPromises([emptyEntry], questionKeysAndIds, '123', 'test-token')

    expect(result).toEqual([undefined])
  })

  it('returns an array with undefined when the answer is a file', () => {
    const fileEntry: [string, File] = ['key1', new File([''], 'filename.txt')]
    const questionKeysAndIds = [{ key: 'key1', id: 1 }]

    const result = buildAnswerPromises([fileEntry], questionKeysAndIds, '123', 'test-token')

    expect(result).toEqual([undefined])
  })

  it('returns an array with undefined when questionKeysAndIds does not contain the entry key', () => {
    const entry: [string, string] = ['key1', 'test']
    const questionKeysAndIds = [{ key: 'key2', id: 1 }]

    const result = buildAnswerPromises([entry], questionKeysAndIds, '123', 'test-token')

    expect(result).toEqual([undefined])
  })
})
