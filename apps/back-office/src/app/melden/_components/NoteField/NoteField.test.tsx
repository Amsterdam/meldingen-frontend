import { render, screen } from '@testing-library/react'

import { NoteField } from './NoteField'

describe('NoteField', () => {
  it('renders the note textarea with the default value', () => {
    render(<NoteField defaultValue="Some note text" />)

    const textArea = screen.getByRole('textbox', { name: 'label (niet verplicht)' })

    expect(textArea).toBeInTheDocument()
    expect(textArea).toHaveValue('Some note text')
  })

  it('renders an error message when there is one', () => {
    render(<NoteField defaultValue="" errorMessage="Test error message" />)

    const textAreaWithErrorMessage = screen.getByRole('textbox', {
      description: 'Invoerfout:Test error message',
      name: 'label (niet verplicht)',
    })

    expect(textAreaWithErrorMessage).toBeInTheDocument()
  })

  it('marks the Field and textarea as invalid when there is an error message', () => {
    const { container } = render(<NoteField defaultValue="" errorMessage="Test error message" />)

    const field = container.firstChild
    expect(field).toHaveClass('ams-field--invalid')

    const textArea = screen.getByRole('textbox', { name: 'label (niet verplicht)' })
    expect(textArea).toHaveAttribute('aria-invalid', 'true')
  })
})
