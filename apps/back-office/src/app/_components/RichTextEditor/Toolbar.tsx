import type { Editor, EditorStateSnapshot } from '@tiptap/react'

import { IconButton } from '@amsterdam/design-system-react'
import {
  FormattingBoldIcon,
  FormattingItalicIcon,
  FormattingUnderlineIcon,
  ListIcon,
  UndoIcon,
} from '@amsterdam/design-system-react-icons'
import { useEditorState } from '@tiptap/react'

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

export const Toolbar = ({ editor, id }: Props) => {
  const editorState = useEditorState({
    editor,
    selector: toolbarStateSelector,
  })

  return (
    <div aria-controls={id} aria-label="Opmaak" role="toolbar">
      <IconButton
        aria-pressed={editorState.isBold}
        label="Bold"
        onClick={() => editor.chain().focus().toggleBold().run()}
        svg={FormattingBoldIcon}
      />
      <IconButton
        aria-pressed={editorState.isItalic}
        label="Italic"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        svg={FormattingItalicIcon}
      />
      <IconButton
        aria-pressed={editorState.isUnderline}
        label="Underline"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        svg={FormattingUnderlineIcon}
      />
      <IconButton
        aria-pressed={editorState.isBulletList}
        label="Unordered list"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        svg={ListIcon}
      />
      <IconButton
        aria-disabled={!editorState.canUndo}
        label="Undo"
        onClick={() => editor.chain().focus().undo().run()}
        svg={UndoIcon}
      />
    </div>
  )
}
