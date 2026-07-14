import type { MarkdownParseHelpers } from '@tiptap/core'

import { richTextExtensions } from './richTextExtensions'

describe('richTextExtensions', () => {
  it('falls back to an empty string when a heading token has no raw value', () => {
    const headingAsText = richTextExtensions.find((extension) => extension.name === 'headingAsText')

    expect(headingAsText?.config.parseMarkdown).toBeDefined()
    expect(headingAsText?.config.parseMarkdown?.({}, {} as MarkdownParseHelpers)).toEqual({
      content: [{ text: '', type: 'text' }],
      type: 'paragraph',
    })
  })
})
