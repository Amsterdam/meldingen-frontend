import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeAll } from 'vitest'

import { RichTextEditor } from './RichTextEditor'

const defaultProps = {
  'aria-labelledby': 'label-id',
  defaultValue: '',
  id: 'editor',
  invalid: false,
  name: 'note',
}

describe('RichTextEditor', () => {
  // jsdom does not implement the layout APIs ProseMirror relies on to translate
  // DOM events into document positions, so we stub them for editor interactions.
  beforeAll(() => {
    document.elementFromPoint = () => null

    const rect = {} as DOMRect

    Range.prototype.getClientRects = () => [rect] as unknown as DOMRectList
    Range.prototype.getBoundingClientRect = () => rect
  })

  it('renders a loader before the editor has finished initializing', () => {
    const { container } = render(<RichTextEditor {...defaultProps} />)

    expect(container.querySelector('div')).toBeInTheDocument()
    expect(screen.queryByRole('toolbar')).not.toBeInTheDocument()
  })

  it('renders a hidden input with the default value as JSON before the editor has loaded', () => {
    render(<RichTextEditor {...defaultProps} defaultValue="Hello world" name="addNote" />)

    expect(screen.queryByRole('toolbar')).not.toBeInTheDocument()

    const input = document.querySelector('input[name="addNote"]') as HTMLInputElement

    expect(input).not.toBeNull()
    expect(input.type).toBe('hidden')
    expect(JSON.parse(input.value)).toEqual({
      content: [{ content: [{ text: 'Hello world', type: 'text' }], type: 'paragraph' }],
      type: 'doc',
    })
  })

  it('renders the toolbar, editable content, and character count once loaded', async () => {
    render(<RichTextEditor {...defaultProps} defaultValue="Hello world" />)

    expect(await screen.findByRole('toolbar')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByText('11 van 3000 tekens')).toBeInTheDocument()
  })

  it('renders a hidden input with the given name and the document as JSON', async () => {
    render(<RichTextEditor {...defaultProps} defaultValue="Hello world" name="addNote" />)

    await screen.findByRole('textbox')

    const input = document.querySelector('input[name="addNote"]') as HTMLInputElement

    expect(input).not.toBeNull()
    expect(input.type).toBe('hidden')
    expect(JSON.parse(input.value)).toEqual({
      content: [{ content: [{ text: 'Hello world', type: 'text' }], type: 'paragraph' }],
      type: 'doc',
    })
  })

  it('sets the aria attributes on the editable element based on the given props', async () => {
    render(<RichTextEditor {...defaultProps} aria-describedby="described-by-id" aria-required="true" invalid />)

    const textbox = await screen.findByRole('textbox')

    expect(textbox).toHaveAttribute('id', 'editor')
    expect(textbox).toHaveAttribute('aria-describedby', 'described-by-id')
    expect(textbox).toHaveAttribute('aria-labelledby', 'label-id')
    expect(textbox).toHaveAttribute('aria-required', 'true')
    expect(textbox).toHaveAttribute('aria-invalid', 'true')
  })

  it('defaults optional aria attributes when they are not given', async () => {
    render(<RichTextEditor {...defaultProps} />)

    const textbox = await screen.findByRole('textbox')

    expect(textbox).toHaveAttribute('aria-describedby', '')
    expect(textbox).toHaveAttribute('aria-required', 'false')
    expect(textbox).toHaveAttribute('aria-invalid', 'false')
  })

  it('updates the character count and hidden input when the user types', async () => {
    const user = userEvent.setup()

    render(<RichTextEditor {...defaultProps} />)

    const textbox = await screen.findByRole('textbox')

    await user.click(textbox)
    await user.type(textbox, 'Hi')

    await waitFor(() => {
      expect(screen.getByText('2 van 3000 tekens')).toBeInTheDocument()
    })

    const input = document.querySelector('input[name="note"]') as HTMLInputElement

    expect(JSON.parse(input.value)).toEqual({
      content: [{ content: [{ text: 'Hi', type: 'text' }], type: 'paragraph' }],
      type: 'doc',
    })
  })
})
