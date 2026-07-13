import { markdownToJSON, parseNoteDocument } from './parseNoteDocument'

const doc = (content: unknown) => JSON.stringify({ content, type: 'doc' })

describe('markdownToJSON', () => {
  it('returns a JSON string representing the parsed document', () => {
    const result = markdownToJSON('Hello world')

    expect(() => JSON.parse(result)).not.toThrow()
    expect(JSON.parse(result)).toMatchObject({
      content: [{ content: [{ text: 'Hello world', type: 'text' }], type: 'paragraph' }],
      type: 'doc',
    })
  })

  it('parses markdown formatting syntax into marks', () => {
    const json = markdownToJSON('**Bold**')

    const parsed = JSON.parse(json)

    expect(parsed).toMatchObject({
      content: [
        {
          content: [{ marks: [{ type: 'bold' }], text: 'Bold', type: 'text' }],
          type: 'paragraph',
        },
      ],
      type: 'doc',
    })
  })

  it('produces output that parseNoteDocument can consume to recover the original text', () => {
    const json = markdownToJSON('++Hello world++')

    const result = parseNoteDocument(json)

    expect(result.characterCount).toBe(11)
    expect(result.isEmpty).toBe(false)
  })

  it('returns an empty doc for an empty string', () => {
    const result = parseNoteDocument(markdownToJSON(''))

    expect(result).toEqual({ characterCount: 0, isEmpty: true, markdown: '' })
  })
})

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

  it('treats a document containing only (formatted) whitespace as empty', () => {
    const value = doc([
      {
        content: [
          { text: '   ', type: 'text' }, // Regular whitespace
          { marks: [{ type: 'bold' }], text: '   ', type: 'text' }, // Bold whitespace
          { marks: [{ type: 'italic' }], text: '   ', type: 'text' }, // Italic whitespace
          { marks: [{ type: 'underline' }], text: '   ', type: 'text' }, // Underlined whitespace
          { marks: [{ type: 'bold' }, { type: 'italic' }, { type: 'underline' }], text: '   ', type: 'text' }, // Bold, italic, and underlined whitespace
        ],
        type: 'paragraph',
      },
      { content: [{ content: [{ type: 'paragraph' }], type: 'listItem' }], type: 'bulletList' }, // List item with empty paragraph
    ])

    const result = parseNoteDocument(value)

    expect(result.characterCount).toBe(15)
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
