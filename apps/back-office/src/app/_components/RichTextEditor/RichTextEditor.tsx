'use client'

import { CharacterCount as ADSCharacterCount, ErrorMessage, Field, Label } from '@amsterdam/design-system-react'
import { CharacterCount as TipTapCharacterCount, UndoRedo } from '@tiptap/extensions'
import { EditorContent, useEditor } from '@tiptap/react'
import { useState } from 'react'

import { getAriaDescribedBy } from '@meldingen/form-renderer'

import { Toolbar } from './Toolbar'
import { markdownManager } from '~/app/_utils/parseNoteDocument'
import { richTextExtensions } from '~/app/_utils/richTextExtensions'
import { MAX_NOTE_LENGTH } from '~/constants'

import styles from './RichTextEditor.module.css'

type Props = {
  defaultValue: string
  errorMessage?: string
  id: string
  label: string
  labelClassName?: string
  name: string
  optional?: boolean
  required?: boolean
}

export const RichTextEditor = ({
  defaultValue,
  errorMessage,
  id,
  label,
  labelClassName,
  name,
  optional,
  required,
}: Props) => {
  const isInvalid = Boolean(errorMessage)
  const labelId = `${id}-label`
  const errorId = `${id}-error`

  // Seeds the hidden input with valid JSON before the editor itself has mounted, so a submit
  // during that window carries the real defaultValue instead of nothing.
  const [content, setContent] = useState(() => JSON.stringify(markdownManager.parse(defaultValue)))
  const [characterCount, setCharacterCount] = useState<number>()
  const [hasLoaded, setHasLoaded] = useState(false)

  const editor = useEditor({
    content: defaultValue,
    contentType: 'markdown',
    editorProps: {
      attributes: {
        'aria-describedby': getAriaDescribedBy(id, undefined, errorMessage) ?? '',
        'aria-invalid': isInvalid ? 'true' : 'false',
        'aria-labelledby': labelId,
        'aria-multiline': 'true',
        'aria-required': required ? 'true' : 'false',
        class: styles.editor,
        id,
        role: 'textbox',
      },
    },
    extensions: [...richTextExtensions, TipTapCharacterCount, UndoRedo],
    immediatelyRender: false, // Don't render immediately on the server to avoid SSR issues
    onCreate: ({ editor: createdEditor }) => {
      // Pass around JSON rather than markdown so we can count characters more precisely on the server side
      // (markdown serialization can lose information, e.g. whitespace-only content).
      setContent(JSON.stringify(createdEditor.getJSON()))
      setCharacterCount(createdEditor.storage.characterCount.characters())
      setHasLoaded(true)
    },
    onUpdate: ({ editor: updatedEditor }) => {
      setContent(JSON.stringify(updatedEditor.getJSON()))
      setCharacterCount(updatedEditor.storage.characterCount.characters())
    },
  })

  return (
    <Field invalid={isInvalid}>
      <Label className={labelClassName} id={labelId} onClick={() => editor?.commands.focus()} optional={optional}>
        {label}
      </Label>
      {errorMessage && <ErrorMessage id={errorId}>{errorMessage}</ErrorMessage>}
      {!editor || !hasLoaded ? (
        <div className={styles.loader} />
      ) : (
        <>
          <Toolbar editor={editor} id={id} />
          <EditorContent editor={editor} />
          {characterCount !== undefined && (
            <ADSCharacterCount className={styles.characterCount} length={characterCount} maxLength={MAX_NOTE_LENGTH} />
          )}
        </>
      )}
      <input name={name} type="hidden" value={content} />
    </Field>
  )
}
