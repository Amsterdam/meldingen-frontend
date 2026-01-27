import { buildAnswerPromises } from './buildAnswerPromises'

const defaultArgs = {
  entries: [['key1', 'test']] as [string, string | string[]][],
  meldingId: '123',
  questionAndAnswerIdPairs: [],
  questionMetadata: [{ id: 1, key: 'key1', type: 'textfield' }],
  token: 'test-token',
}

describe('buildAnswerPromises', () => {
  it('returns an array with undefined when the answer is an empty string', () => {
    const emptyEntry: [string, string] = ['key1', '']

    const result = buildAnswerPromises({ ...defaultArgs, entries: [emptyEntry] })
    expect(result).toEqual([undefined])
  })

  it('returns an array with undefined when questionMetadata does not contain the entry key', () => {
    const questionMetadata = [{ id: 1, key: 'key2', type: 'textfield' }]

    const result = buildAnswerPromises({ ...defaultArgs, questionMetadata })
    expect(result).toEqual([undefined])
  })

  it('returns an array with undefined when questionMetadata contains no type for the entry key', () => {
    const questionMetadata = [{ id: 1, key: 'key1', type: '' }]

    const result = buildAnswerPromises({ ...defaultArgs, questionMetadata })
    expect(result).toEqual([undefined])
  })

  it('does a PATCH request when an entry has an answerId (answer already exists)', async () => {
    const questionAndAnswerIdPairs = [{ answerId: 2, questionId: 1 }]

    const result = buildAnswerPromises({ ...defaultArgs, entries: [['key1', 'test']], questionAndAnswerIdPairs })

    expect(await result[0]).toMatchObject({
      key: 'key1',
      value: {
        data: expect.objectContaining({ id: 1, text: 'PATCH request' }),
      },
    })
  })

  it('does a POST request when an entry does not have an answerId (answer does not already exist)', async () => {
    const result = buildAnswerPromises({ ...defaultArgs, entries: [['key1', 'test']] })

    expect(await result[0]).toMatchObject({
      key: 'key1',
      value: {
        data: expect.objectContaining({ id: 1, text: 'POST request' }),
      },
    })
  })

  it('handles array values (e.g., checkbox inputs)', async () => {
    const entry: [string, string[]] = ['key1', ['value1', 'value2']]
    const questionMetadata = [
      {
        id: 1,
        key: 'key1',
        type: 'checkbox',
        valuesAndLabels: [
          { label: 'Label 1', value: 'value1' },
          { label: 'Label 2', value: 'value2' },
        ],
      },
    ]

    const result = buildAnswerPromises({ ...defaultArgs, entries: [entry], questionMetadata })

    expect(await result[0]).toMatchObject({ key: 'key1' })
  })

  it('handles radio inputs', async () => {
    const entry: [string, string] = ['key1', 'value1']
    const questionMetadata = [
      {
        id: 1,
        key: 'key1',
        type: 'radio',
        valuesAndLabels: [
          { label: 'Label 1', value: 'value1' },
          { label: 'Label 2', value: 'value2' },
        ],
      },
    ]

    const result = buildAnswerPromises({ ...defaultArgs, entries: [entry], questionMetadata })

    expect(await result[0]).toMatchObject({ key: 'key1' })
  })

  it('handles select inputs', async () => {
    const entry: [string, string] = ['key1', 'value1']
    const questionMetadata = [
      {
        id: 1,
        key: 'key1',
        type: 'select',
        valuesAndLabels: [
          { label: 'Label 1', value: 'value1' },
          { label: 'Label 2', value: 'value2' },
        ],
      },
    ]

    const result = buildAnswerPromises({ ...defaultArgs, entries: [entry], questionMetadata })

    expect(await result[0]).toMatchObject({ key: 'key1' })
  })

  it('handles textarea inputs', async () => {
    const questionMetadata = [
      {
        id: 1,
        key: 'key1',
        type: 'textarea',
      },
    ]

    const result = buildAnswerPromises({ ...defaultArgs, questionMetadata })

    expect(await result[0]).toMatchObject({ key: 'key1' })
  })

  it('handles time inputs', async () => {
    const questionMetadata = [
      {
        id: 1,
        key: 'key1',
        type: 'time',
      },
    ]

    const result = buildAnswerPromises({ ...defaultArgs, questionMetadata })

    expect(await result[0]).toMatchObject({ key: 'key1' })
  })

  it('returns type text for unknown question types', async () => {
    const questionMetadata = [
      {
        id: 1,
        key: 'key1',
        type: 'unknown-type',
      },
    ]

    const result = buildAnswerPromises({ ...defaultArgs, questionMetadata })

    expect(await result[0]).toMatchObject({ key: 'key1' })
  })

  it('returns undefined for checkbox inputs with no matching valuesAndLabels', () => {
    const entry: [string, string[]] = ['key1', ['nonexistentValue']]
    const questionMetadata = [
      {
        id: 1,
        key: 'key1',
        type: 'checkbox',
        valuesAndLabels: [
          { label: 'Label 1', value: 'value1' },
          { label: 'Label 2', value: 'value2' },
        ],
      },
    ]

    const result = buildAnswerPromises({ ...defaultArgs, entries: [entry], questionMetadata })

    expect(result).toEqual([undefined])
  })

  it('returns undefined for select inputs with no matching valuesAndLabels', () => {
    const entry: [string, string] = ['key1', 'nonexistentValue']
    const questionMetadata = [
      {
        id: 1,
        key: 'key1',
        type: 'select',
        valuesAndLabels: [
          { label: 'Label 1', value: 'value1' },
          { label: 'Label 2', value: 'value2' },
        ],
      },
    ]

    const result = buildAnswerPromises({ ...defaultArgs, entries: [entry], questionMetadata })

    expect(result).toEqual([undefined])
  })

  it('returns undefined for radio inputs with no matching valuesAndLabels', () => {
    const entry: [string, string] = ['key1', 'nonexistentValue']
    const questionMetadata = [
      {
        id: 1,
        key: 'key1',
        type: 'radio',
        valuesAndLabels: [
          { label: 'Label 1', value: 'value1' },
          { label: 'Label 2', value: 'value2' },
        ],
      },
    ]

    const result = buildAnswerPromises({ ...defaultArgs, entries: [entry], questionMetadata })

    expect(result).toEqual([undefined])
  })

  it('returns undefined for a PATCH request with checkbox inputs with no matching valuesAndLabels', () => {
    const entry: [string, string[]] = ['key1', ['nonexistentValue']]
    const questionMetadata = [
      {
        id: 1,
        key: 'key1',
        type: 'checkbox',
        valuesAndLabels: [
          { label: 'Label 1', value: 'value1' },
          { label: 'Label 2', value: 'value2' },
        ],
      },
    ]
    const questionAndAnswerIdPairs = [{ answerId: 2, questionId: 1 }]

    const result = buildAnswerPromises({ ...defaultArgs, entries: [entry], questionAndAnswerIdPairs, questionMetadata })

    expect(result).toEqual([undefined])
  })
})
