import { getSchema } from '@tiptap/core'
import { MarkdownManager } from '@tiptap/markdown'
import { Node } from '@tiptap/pm/model'

import { richTextExtensions } from '~/app/_utils/richTextExtensions'

// Reuses the same schema and markdown parsing rules as RichTextEditor.
const schema = getSchema(richTextExtensions)
const markdownManager = new MarkdownManager({ extensions: richTextExtensions })

// Lets RichTextEditor seed its hidden input with valid JSON before the editor itself has
// mounted, so a submit during that window carries the real defaultValue instead of nothing.
export const markdownToJSON = (markdown: string) => JSON.stringify(markdownManager.parse(markdown))

// Reused by NoteContent to render a note's markdown as React elements without going through
// generateHTML, which needs a browser DOM and can't run during Next's server render.
export const parseNoteMarkdown = (markdown: string) => markdownManager.parse(markdown)

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
