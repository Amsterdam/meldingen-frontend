'use client'

import { CharacterCount as ADSCharacterCount } from '@amsterdam/design-system-react'
import { Bold } from '@tiptap/extension-bold'
import { Document } from '@tiptap/extension-document'
import { Italic } from '@tiptap/extension-italic'
import { BulletList, ListItem } from '@tiptap/extension-list'
import { Paragraph } from '@tiptap/extension-paragraph'
import { Text } from '@tiptap/extension-text'
import { Underline } from '@tiptap/extension-underline'
import { CharacterCount } from '@tiptap/extensions'
import { UndoRedo } from '@tiptap/extensions'
import { Markdown } from '@tiptap/markdown'
import { EditorContent, useEditor } from '@tiptap/react'
import { useState } from 'react'

import { Toolbar } from './Toolbar'
import { MAX_NOTE_LENGTH } from '~/constants'

import styles from './RichTextEditor.module.css'

type Props = {
  'aria-describedby'?: string
  'aria-labelledby': string
  'aria-required'?: string
  defaultValue: string
  id: string
  invalid: boolean
  name: string
}

export const RichTextEditor = ({
  'aria-describedby': ariaDescribedBy,
  'aria-labelledby': ariaLabelledBy,
  'aria-required': ariaRequired,
  defaultValue,
  id,
  invalid,
  name,
}: Props) => {
  const [content, setContent] = useState(defaultValue)
  const [charactersCount, setCharactersCount] = useState<number>()

  const editor = useEditor({
    content: defaultValue,
    contentType: 'markdown',
    editorProps: {
      attributes: {
        'aria-describedby': ariaDescribedBy ?? '',
        'aria-invalid': invalid ? 'true' : 'false',
        'aria-labelledby': ariaLabelledBy,
        'aria-required': ariaRequired ?? 'false',
        class: styles.editor,
        id,
        role: 'textbox',
      },
    },
    extensions: [
      Document,
      Paragraph.configure({
        HTMLAttributes: { class: 'ams-paragraph' },
      }),
      Text,
      Bold,
      Italic,
      Underline,
      Markdown,
      CharacterCount,
      BulletList.configure({
        HTMLAttributes: { class: 'ams-unordered-list' },
      }),
      ListItem.configure({
        HTMLAttributes: { class: 'ams-unordered-list__item' },
      }),
      UndoRedo,
    ],
    immediatelyRender: false, // Don't render immediately on the server to avoid SSR issues
    onCreate: ({ editor: createdEditor }) => setCharactersCount(createdEditor.storage.characterCount.characters()),
    onUpdate: ({ editor: updatedEditor }) => {
      setContent(updatedEditor.getMarkdown())
      setCharactersCount(updatedEditor.storage.characterCount.characters())
    },
  })

  if (!editor) {
    return null
  }

  return (
    <>
      <Toolbar editor={editor} id={id} />
      <EditorContent editor={editor} />
      {charactersCount !== undefined && <ADSCharacterCount length={charactersCount} maxLength={MAX_NOTE_LENGTH} />}
      <input name={name} type="hidden" value={content} />
    </>
  )
}
