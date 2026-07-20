import { render, screen } from '@testing-library/react'

import { NoteField } from './NoteField'

describe('NoteField', () => {
  it('renders the note rich text editor with the default value', async () => {
    render(<NoteField defaultValue="Some note text" />)

    expect(await screen.findByRole('toolbar')).toBeInTheDocument()

    const textArea = screen.getByRole('textbox', { name: 'label (niet verplicht)' })

    expect(textArea).toBeInTheDocument()
    expect(textArea).toHaveTextContent('Some note text')
  })

  it('renders an error message when there is one', async () => {
    render(<NoteField defaultValue="" errorMessage="Test error message" />)

    expect(await screen.findByRole('toolbar')).toBeInTheDocument()

    const textAreaWithErrorMessage = screen.getByRole('textbox', {
      description: 'Invoerfout:Test error message',
      name: 'label (niet verplicht)',
    })

    expect(textAreaWithErrorMessage).toBeInTheDocument()
  })

  it('marks the Field and textarea as invalid when there is an error message', async () => {
    const { container } = render(<NoteField defaultValue="" errorMessage="Test error message" />)

    expect(await screen.findByRole('toolbar')).toBeInTheDocument()

    const field = container.firstChild
    expect(field).toHaveClass('ams-field--invalid')

    const textArea = screen.getByRole('textbox', { name: 'label (niet verplicht)' })
    expect(textArea).toHaveAttribute('aria-invalid', 'true')
  })
})
