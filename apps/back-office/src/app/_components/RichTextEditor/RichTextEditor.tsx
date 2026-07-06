'use client'

import { Bold } from '@tiptap/extension-bold'
import { Document } from '@tiptap/extension-document'
import { Heading } from '@tiptap/extension-heading'
import { Italic } from '@tiptap/extension-italic'
import { Paragraph } from '@tiptap/extension-paragraph'
import { Text } from '@tiptap/extension-text'
import { Underline } from '@tiptap/extension-underline'
import { Markdown } from '@tiptap/markdown'
import { EditorContent, useEditor } from '@tiptap/react'

type Props = {
  'aria-labelledby': string
  defaultValue: string
  id: string
  name: string
}

export const RichTextEditor = ({ 'aria-labelledby': ariaLabelledBy, defaultValue, id, name }: Props) => {
  const editor = useEditor({
    content: defaultValue,
    contentType: 'markdown',
    editorProps: {
      attributes: { 'aria-labelledby': ariaLabelledBy, id, name, role: 'textbox' },
    },
    extensions: [Document, Paragraph, Text, Bold, Italic, Underline, Heading, Markdown],
    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,
  })

  return <EditorContent editor={editor} />
}
