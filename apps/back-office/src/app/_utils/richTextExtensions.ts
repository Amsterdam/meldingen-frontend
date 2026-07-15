import { Extension } from '@tiptap/core'
import { Bold } from '@tiptap/extension-bold'
import { Document } from '@tiptap/extension-document'
import { Italic } from '@tiptap/extension-italic'
import { BulletList, ListItem } from '@tiptap/extension-list'
import { Paragraph } from '@tiptap/extension-paragraph'
import { Text } from '@tiptap/extension-text'
import { Underline } from '@tiptap/extension-underline'
import { Markdown } from '@tiptap/markdown'

// We don't allow headings in notes, but if a user types '# Heading' in the editor,
// TipTap interprets that as a heading and throws an error. This extension intercepts this and just returns '# Heading'.
const HeadingAsText = Extension.create({
  markdownTokenName: 'heading',
  name: 'headingAsText',
  parseMarkdown: (token) => ({
    content: [{ text: (token.raw ?? '').trim(), type: 'text' }],
    type: 'paragraph',
  }),
})

// These TipTap extensions are shared between the client-side editor and the server-side markdown character count,
// so that the character count on the server matches the character count the user sees.
export const richTextExtensions = [
  Document,
  Paragraph.configure({ HTMLAttributes: { class: 'ams-paragraph' } }),
  Text,
  Bold,
  Italic,
  Underline,
  Markdown,
  HeadingAsText,
  BulletList.configure({ HTMLAttributes: { class: 'ams-unordered-list' } }),
  ListItem.configure({ HTMLAttributes: { class: 'ams-unordered-list__item' } }),
]
