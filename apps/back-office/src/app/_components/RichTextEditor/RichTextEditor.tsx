'use client'

import { CharacterCount as ADSCharacterCount } from '@amsterdam/design-system-react'
import { CharacterCount } from '@tiptap/extensions'
import { UndoRedo } from '@tiptap/extensions'
import { EditorContent, useEditor } from '@tiptap/react'
import { useState } from 'react'

import { richTextExtensions } from './extensions'
import { Toolbar } from './Toolbar'
import { markdownToJSON } from '~/app/_utils/parseNoteDocument'
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
  const [content, setContent] = useState(() => markdownToJSON(defaultValue))
  const [charactersCount, setCharactersCount] = useState<number>()
  const [hasLoaded, setHasLoaded] = useState(false)

  const editor = useEditor({
    content: defaultValue,
    contentType: 'markdown',
    editorProps: {
      attributes: {
        'aria-describedby': ariaDescribedBy ?? '',
        'aria-invalid': invalid ? 'true' : 'false',
        'aria-labelledby': ariaLabelledBy,
        'aria-multiline': 'true',
        'aria-required': ariaRequired ?? 'false',
        class: styles.editor,
        id,
        role: 'textbox',
      },
    },
    extensions: [...richTextExtensions, CharacterCount, UndoRedo],
    immediatelyRender: false, // Don't render immediately on the server to avoid SSR issues
    onCreate: ({ editor: createdEditor }) => {
      // Pass around JSON rather than markdown so we can count characters more precisely on the server side
      // (markdown serialization can lose information, e.g. whitespace-only content).
      setContent(JSON.stringify(createdEditor.getJSON()))
      setCharactersCount(createdEditor.storage.characterCount.characters())
      setHasLoaded(true)
    },
    onUpdate: ({ editor: updatedEditor }) => {
      setContent(JSON.stringify(updatedEditor.getJSON()))
      setCharactersCount(updatedEditor.storage.characterCount.characters())
    },
  })

  if (!editor || !hasLoaded) {
    return (
      <>
        <div className={styles.loader} />
        <input name={name} type="hidden" value={content} />
      </>
    )
  }

  return (
    <>
      <Toolbar editor={editor} id={id} />
      <EditorContent editor={editor} />
      {charactersCount !== undefined && (
        <ADSCharacterCount className={styles.characterCount} length={charactersCount} maxLength={MAX_NOTE_LENGTH} />
      )}
      <input name={name} type="hidden" value={content} />
    </>
  )
}
