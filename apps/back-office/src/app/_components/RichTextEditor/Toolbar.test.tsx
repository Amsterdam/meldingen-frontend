import type { Editor } from '@tiptap/react'

import { fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Bold } from '@tiptap/extension-bold'
import { Document } from '@tiptap/extension-document'
import { Italic } from '@tiptap/extension-italic'
import { BulletList, ListItem } from '@tiptap/extension-list'
import { Paragraph } from '@tiptap/extension-paragraph'
import { Text } from '@tiptap/extension-text'
import { Underline } from '@tiptap/extension-underline'
import { UndoRedo } from '@tiptap/extensions'
import { useEditor } from '@tiptap/react'

import { Toolbar } from './Toolbar'

const renderToolbar = async () => {
  const { result } = renderHook(() =>
    useEditor({
      content: '<p>Hello</p>',
      extensions: [Document, Paragraph, Text, Bold, Italic, Underline, BulletList, ListItem, UndoRedo],
      immediatelyRender: false,
    }),
  )

  await waitFor(() => expect(result.current).not.toBeNull())

  const editor = result.current as Editor

  render(<Toolbar editor={editor} id="editor" />)

  return editor
}

describe('Toolbar', () => {
  it('renders a toolbar with a button for each formatting action', async () => {
    await renderToolbar()

    const toolbar = screen.getByRole('toolbar', { name: 'toolbar' })

    expect(toolbar).toHaveAttribute('aria-controls', 'editor')
    expect(screen.getByRole('button', { name: 'bold' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'italic' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'underline' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'unordered-list' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'undo' })).toBeInTheDocument()
  })

  it('only makes the bold button tabbable initially', async () => {
    await renderToolbar()

    expect(screen.getByRole('button', { name: 'bold' })).toHaveAttribute('tabindex', '0')
    expect(screen.getByRole('button', { name: 'italic' })).toHaveAttribute('tabindex', '-1')
    expect(screen.getByRole('button', { name: 'underline' })).toHaveAttribute('tabindex', '-1')
    expect(screen.getByRole('button', { name: 'unordered-list' })).toHaveAttribute('tabindex', '-1')
    expect(screen.getByRole('button', { name: 'undo' })).toHaveAttribute('tabindex', '-1')
  })

  it('moves the tabbable button to whichever button receives focus', async () => {
    await renderToolbar()

    fireEvent.focus(screen.getByRole('button', { name: 'italic' }))

    expect(screen.getByRole('button', { name: 'italic' })).toHaveAttribute('tabindex', '0')
    expect(screen.getByRole('button', { name: 'bold' })).toHaveAttribute('tabindex', '-1')
  })

  it('supports rotating horizontal arrow key navigation between buttons', async () => {
    const user = userEvent.setup()
    await renderToolbar()

    const boldButton = screen.getByRole('button', { name: 'bold' })
    const undoButton = screen.getByRole('button', { name: 'undo' })

    boldButton.focus()
    await user.keyboard('{ArrowLeft}')

    expect(document.activeElement).toBe(undoButton)

    await user.keyboard('{ArrowRight}')

    expect(document.activeElement).toBe(boldButton)
  })

  it('reflects that no mark is active and that undo is disabled by default', async () => {
    await renderToolbar()

    expect(screen.getByRole('button', { name: 'bold' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: 'italic' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: 'underline' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: 'unordered-list' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: 'undo' })).toHaveAttribute('aria-disabled', 'true')
  })

  it('toggles bold on the selection and enables undo when the bold button is clicked', async () => {
    const user = userEvent.setup()
    const editor = await renderToolbar()

    editor.commands.selectAll()

    await user.click(screen.getByRole('button', { name: 'bold' }))

    expect(editor.isActive('bold')).toBe(true)
    expect(screen.getByRole('button', { name: 'bold' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'undo' })).toHaveAttribute('aria-disabled', 'false')
  })

  it('toggles italic on the selection when the italic button is clicked', async () => {
    const user = userEvent.setup()
    const editor = await renderToolbar()

    editor.commands.selectAll()

    await user.click(screen.getByRole('button', { name: 'italic' }))

    expect(editor.isActive('italic')).toBe(true)
    expect(screen.getByRole('button', { name: 'italic' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('toggles underline on the selection when the underline button is clicked', async () => {
    const user = userEvent.setup()
    const editor = await renderToolbar()

    editor.commands.selectAll()

    await user.click(screen.getByRole('button', { name: 'underline' }))

    expect(editor.isActive('underline')).toBe(true)
    expect(screen.getByRole('button', { name: 'underline' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('toggles a bullet list on the selection when the unordered list button is clicked', async () => {
    const user = userEvent.setup()
    const editor = await renderToolbar()

    editor.commands.selectAll()

    await user.click(screen.getByRole('button', { name: 'unordered-list' }))

    expect(editor.isActive('bulletList')).toBe(true)
    expect(screen.getByRole('button', { name: 'unordered-list' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('undoes the last change when the undo button is clicked', async () => {
    const user = userEvent.setup()
    const editor = await renderToolbar()

    editor.commands.selectAll()
    editor.commands.toggleBold()

    expect(editor.isActive('bold')).toBe(true)

    await user.click(screen.getByRole('button', { name: 'undo' }))

    expect(editor.isActive('bold')).toBe(false)
  })

  it('falls back to false for every state value when the editor reports nullish state', () => {
    const editor = {
      can: () => ({ chain: () => ({ undo: () => ({ run: () => undefined }) }) }),
      isActive: () => undefined,
      off: () => {},
      on: () => {},
    } as unknown as Editor

    render(<Toolbar editor={editor} id="editor" />)

    expect(screen.getByRole('button', { name: 'bold' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: 'italic' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: 'underline' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: 'unordered-list' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: 'undo' })).toHaveAttribute('aria-disabled', 'true')
  })
})
