import type { Editor, EditorStateSnapshot } from '@tiptap/react'
import type { RefObject } from 'react'

import { IconButton } from '@amsterdam/design-system-react'
import {
  FormattingBoldIcon,
  FormattingItalicIcon,
  FormattingUnderlineIcon,
  ListIcon,
  UndoIcon,
} from '@amsterdam/design-system-react-icons'
import { useKeyboardFocus } from '@amsterdam/design-system-react/dist/common/useKeyboardFocus'
import { useEditorState } from '@tiptap/react'
import { useRef, useState } from 'react'

import styles from './Toolbar.module.css'

const toolbarStateSelector = (ctx: EditorStateSnapshot<Editor>) => {
  return {
    canUndo: ctx.editor.can().chain().undo().run() ?? false,
    isBold: ctx.editor.isActive('bold') ?? false,
    isBulletList: ctx.editor.isActive('bulletList') ?? false,
    isItalic: ctx.editor.isActive('italic') ?? false,
    isUnderline: ctx.editor.isActive('underline') ?? false,
  }
}

type Props = {
  editor: Editor
  id: string
}

type ToolbarButton = 'bold' | 'bulletList' | 'italic' | 'underline' | 'undo'

export const Toolbar = ({ editor, id }: Props) => {
  const ref = useRef<HTMLDivElement>(null)

  const [activeButton, setActiveButton] = useState<ToolbarButton>('bold')

  const editorState = useEditorState({
    editor,
    selector: toolbarStateSelector,
  })

  const { keyDown } = useKeyboardFocus(ref as RefObject<HTMLDivElement>, {
    focusableElements: ['.ams-icon-button:not([disabled])'],
    horizontally: true,
    rotating: true,
  })

  const getTabIndex = (button: ToolbarButton) => (activeButton === button ? 0 : -1)

  return (
    <div aria-controls={id} aria-label="Opmaak" className={styles.toolbar} onKeyDown={keyDown} ref={ref} role="toolbar">
      <IconButton
        aria-pressed={editorState.isBold}
        className={styles.button}
        label="Bold"
        onClick={() => editor.chain().focus().toggleBold().run()}
        onFocus={() => setActiveButton('bold')}
        svg={FormattingBoldIcon}
        tabIndex={getTabIndex('bold')}
      />
      <IconButton
        aria-pressed={editorState.isItalic}
        className={styles.button}
        label="Italic"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        onFocus={() => setActiveButton('italic')}
        svg={FormattingItalicIcon}
        tabIndex={getTabIndex('italic')}
      />
      <IconButton
        aria-pressed={editorState.isUnderline}
        className={styles.button}
        label="Underline"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        onFocus={() => setActiveButton('underline')}
        svg={FormattingUnderlineIcon}
        tabIndex={getTabIndex('underline')}
      />
      <IconButton
        aria-pressed={editorState.isBulletList}
        className={styles.button}
        label="Unordered list"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        onFocus={() => setActiveButton('bulletList')}
        svg={ListIcon}
        tabIndex={getTabIndex('bulletList')}
      />
      <IconButton
        aria-disabled={!editorState.canUndo}
        className={styles.button}
        label="Undo"
        onClick={() => editor.chain().focus().undo().run()}
        onFocus={() => setActiveButton('undo')}
        svg={UndoIcon}
        tabIndex={getTabIndex('undo')}
      />
    </div>
  )
}
