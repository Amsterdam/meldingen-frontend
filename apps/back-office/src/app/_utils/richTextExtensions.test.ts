import type { Extension, MarkdownParseHelpers, MarkdownToken } from '@tiptap/core'

import { MarkdownManager } from '@tiptap/markdown'

import { richTextExtensions } from './richTextExtensions'

const markdownManager = new MarkdownManager({ extensions: richTextExtensions })

const getHeadingAsTextExtension = () => {
  const headingAsText = richTextExtensions.find(
    (extension): extension is Extension => extension.name === 'headingAsText',
  )

  if (!headingAsText) throw new Error('Expected headingAsText extension to be present')

  return headingAsText
}

const parseHeadingToken = (token: MarkdownToken) => {
  const headingAsText = getHeadingAsTextExtension()
  const { parseMarkdown } = headingAsText.config

  if (!parseMarkdown) throw new Error('Expected headingAsText parseMarkdown to be defined')

  const parseMarkdownContext: ThisParameterType<typeof parseMarkdown> = {
    name: headingAsText.name,
    options: headingAsText.options,
    parent: undefined,
    storage: headingAsText.storage,
  }

  return parseMarkdown.call(parseMarkdownContext, token, {} as MarkdownParseHelpers)
}

describe('richTextExtensions', () => {
  it('parses markdown headings as paragraph text instead of heading nodes', () => {
    expect(markdownManager.parse('# Heading')).toEqual({
      content: [
        {
          content: [{ text: '# Heading', type: 'text' }],
          type: 'paragraph',
        },
      ],
      type: 'doc',
    })
  })

  it('falls back to an empty string when a heading token has no raw value', () => {
    expect(parseHeadingToken({ type: 'heading' } as MarkdownToken)).toEqual({
      content: [{ text: '', type: 'text' }],
      type: 'paragraph',
    })
  })
})
