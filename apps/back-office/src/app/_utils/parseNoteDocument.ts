import { getSchema } from '@tiptap/core'
import { MarkdownManager } from '@tiptap/markdown'
import { Node } from '@tiptap/pm/model'

import { richTextExtensions } from '~/app/_utils/richTextExtensions'

// Reuses the same schema and markdown parsing rules as RichTextEditor.
const schema = getSchema(richTextExtensions)

export const markdownManager = new MarkdownManager({ extensions: richTextExtensions })

type ParsedNoteDocument = {
  characterCount: number
  isEmpty: boolean
  markdown: string
}

const EMPTY_NOTE: ParsedNoteDocument = { characterCount: 0, isEmpty: true, markdown: '' }

export const parseNoteDocument = (value: File | string | undefined): ParsedNoteDocument => {
  if (!value) return EMPTY_NOTE

  try {
    const doc = Node.fromJSON(schema, JSON.parse(value.toString()))
    // The doc's own text content, with marks (bold/italic/etc.) and node types (lists, etc.)
    // stripped away structurally rather than by parsing markdown syntax — bold text is just a
    // text node with a mark here, never literal `**` characters, so this can't misinterpret
    // formatting syntax the way string-based stripping could.
    const plainText = doc.textBetween(0, doc.content.size, undefined, ' ')

    return {
      characterCount: plainText.length,
      // A note that's only whitespace (typed directly, or left over from toggling a mark with
      // nothing else typed) is empty, even though it has a non-zero character count.
      isEmpty: plainText.trim() === '',
      markdown: markdownManager.serialize(doc.toJSON()),
    }
  } catch {
    return EMPTY_NOTE
  }
}

// Converts a note's markdown to plain text, e.g. for previews where formatting is not shown.
export const markdownToPlainText = (markdown: string) => {
  const doc = Node.fromJSON(schema, markdownManager.parse(markdown))

  return doc.textBetween(0, doc.content.size, ' ', ' ').trim()
}

export const truncateMarkdown = (markdown: string, maxLength: number) => {
  const plainText = markdownToPlainText(markdown)

  if (plainText.length <= maxLength) return plainText

  return plainText.slice(0, maxLength)
}
