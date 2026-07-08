import { getSchema } from '@tiptap/core'
import { MarkdownManager } from '@tiptap/markdown'
import { Node } from '@tiptap/pm/model'

import { richTextExtensions } from '~/app/_components/RichTextEditor/extensions'

// Reuses the same schema and markdown parsing rules as RichTextEditor.
const schema = getSchema(richTextExtensions)
const markdownManager = new MarkdownManager({ extensions: richTextExtensions })

export type ParsedNoteDocument = {
  characterCount: number
  markdown: string
}

const EMPTY_NOTE: ParsedNoteDocument = { characterCount: 0, markdown: '' }

// RichTextEditor submits the ProseMirror document as JSON rather than as markdown text.
// Counting characters directly from that document (instead of re-parsing markdown serialized
// from it) matches what @tiptap/extensions' CharacterCount shows the user while editing:
// markdown serialization can lose information that the doc itself doesn't have, e.g. a
// whitespace-only paragraph serializes to an empty string. Falls back to an empty result for
// missing or malformed input (e.g. a field that was never actually submitted by RichTextEditor)
// instead of throwing.
export const parseNoteDocument = (value: File | string | undefined): ParsedNoteDocument => {
  if (!value) return EMPTY_NOTE

  try {
    const doc = Node.fromJSON(schema, JSON.parse(value.toString()))
    const docJson = doc.toJSON()

    return {
      characterCount: doc.textBetween(0, doc.content.size, undefined, ' ').length,
      // Calling `renderNodes` directly instead of `serialize` skips MarkdownManager's own
      // "collapse whitespace-only output to an empty string" behavior. We already decide
      // emptiness from `characterCount` above, so a note that passed that check (e.g. a single
      // typed space) must still serialize to non-empty text here — the backend rejects "".
      markdown: markdownManager.renderNodes(docJson, docJson),
    }
  } catch {
    return EMPTY_NOTE
  }
}
