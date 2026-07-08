import { parseNoteDocument } from './parseNoteDocument'

const doc = (content: unknown) => JSON.stringify({ content, type: 'doc' })

describe('parseNoteDocument', () => {
  it('returns an empty result when value is undefined', () => {
    expect(parseNoteDocument(undefined)).toEqual({ characterCount: 0, isEmpty: true, markdown: '' })
  })

  it('returns an empty result when value is an empty string', () => {
    expect(parseNoteDocument('')).toEqual({ characterCount: 0, isEmpty: true, markdown: '' })
  })

  it('returns an empty result when value is not valid JSON', () => {
    expect(parseNoteDocument('not json')).toEqual({ characterCount: 0, isEmpty: true, markdown: '' })
  })

  it('returns an empty result when value is a File (cannot be parsed as JSON)', () => {
    const file = new File(['hello'], 'note.txt', { type: 'text/plain' })

    expect(parseNoteDocument(file)).toEqual({ characterCount: 0, isEmpty: true, markdown: '' })
  })

  it('parses plain text content', () => {
    const value = doc([{ content: [{ text: 'Hello world', type: 'text' }], type: 'paragraph' }])

    const result = parseNoteDocument(value)

    expect(result.characterCount).toBe(11)
    expect(result.isEmpty).toBe(false)
    expect(result.markdown).toContain('Hello world')
  })

  it('treats a document containing only whitespace as empty', () => {
    const value = doc([{ content: [{ text: '   ', type: 'text' }], type: 'paragraph' }])

    const result = parseNoteDocument(value)

    expect(result.characterCount).toBe(3)
    expect(result.isEmpty).toBe(true)
  })

  it('treats a document with no content as empty', () => {
    const value = doc([{ type: 'paragraph' }])

    const result = parseNoteDocument(value)

    expect(result.characterCount).toBe(0)
    expect(result.isEmpty).toBe(true)
  })

  it('counts characters from formatted text without counting markdown syntax', () => {
    const value = doc([
      {
        content: [{ marks: [{ type: 'bold' }], text: 'Bold', type: 'text' }],
        type: 'paragraph',
      },
    ])

    const result = parseNoteDocument(value)

    expect(result.characterCount).toBe(4)
    expect(result.markdown).toContain('**Bold**')
  })

  it('counts characters across multiple paragraphs and list items, separated by spaces', () => {
    const value = doc([
      { content: [{ text: 'One', type: 'text' }], type: 'paragraph' },
      {
        content: [
          { content: [{ content: [{ text: 'Two', type: 'text' }], type: 'paragraph' }], type: 'listItem' },
          { content: [{ content: [{ text: 'Three', type: 'text' }], type: 'paragraph' }], type: 'listItem' },
        ],
        type: 'bulletList',
      },
    ])

    const result = parseNoteDocument(value)

    expect(result.characterCount).toBe(11)
    expect(result.isEmpty).toBe(false)
  })
})
