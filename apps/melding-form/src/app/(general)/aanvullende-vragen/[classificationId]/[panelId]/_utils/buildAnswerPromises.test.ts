import { buildAnswerPromises } from './buildAnswerPromises'

describe('buildAnswerPromises', () => {
  it('returns an array with undefined when the answer is an empty string', () => {
    const emptyEntry: [string, string] = ['key1', '']
    const questionKeysAndIds = [{ id: 1, key: 'key1' }]

    const result = buildAnswerPromises([emptyEntry], '123', questionKeysAndIds, 'test-token')

    expect(result).toEqual([undefined])
  })

  it('returns an array with undefined when the answer is a file', () => {
    const fileEntry: [string, File] = ['key1', new File([''], 'filename.txt')]
    const questionKeysAndIds = [{ id: 1, key: 'key1' }]

    const result = buildAnswerPromises([fileEntry], '123', questionKeysAndIds, 'test-token')

    expect(result).toEqual([undefined])
  })

  it('returns an array with undefined when questionKeysAndIds does not contain the entry key', () => {
    const entry: [string, string] = ['key1', 'test']
    const questionKeysAndIds = [{ id: 1, key: 'key2' }]

    const result = buildAnswerPromises([entry], '123', questionKeysAndIds, 'test-token')

    expect(result).toEqual([undefined])
  })

  it('does a PATCH request when an entry has an answerId (answer already exists)', async () => {
    const entry: [string, string] = ['key1', 'test']
    const questionKeysAndIds = [{ id: 1, key: 'key1' }]
    const questionAndAnswerIdPairs = [{ answerId: 2, questionId: 1 }]

    const result = buildAnswerPromises([entry], '123', questionKeysAndIds, 'test-token', questionAndAnswerIdPairs)

    expect(await result[0]).toMatchObject({
      key: 'key1',
      value: {
        data: expect.objectContaining({
          id: 1,
          text: 'PATCH request',
        }),
      },
    })
  })

  it('does a POST request when an entry does not have an answerId (answer does not already exist)', async () => {
    const entry: [string, string] = ['key1', 'test']
    const questionKeysAndIds = [{ id: 1, key: 'key1' }]

    const result = buildAnswerPromises([entry], '123', questionKeysAndIds, 'test-token')

    expect(await result[0]).toMatchObject({
      key: 'key1',
      value: {
        data: expect.objectContaining({
          id: 1,
          text: 'POST request',
        }),
      },
    })
  })
})
