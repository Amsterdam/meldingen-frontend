import { render, screen } from '@testing-library/react'

import { SourceField } from './SourceField'

const defaultProps = {
  defaultValue: '',
  sources: [
    { created_at: '', id: 1, name: 'Source 1', updated_at: '' },
    { created_at: '', id: 2, name: 'Source 2', updated_at: '' },
  ],
}

describe('SourceField', () => {
  it('renders the source select input with options', () => {
    render(<SourceField {...defaultProps} />)

    const select = screen.getByRole('combobox', { name: 'label' })

    expect(select).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'default' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Source 1' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Source 2' })).toBeInTheDocument()
  })

  it('renders an error message when there is one', () => {
    render(<SourceField {...defaultProps} errorMessage="Test error message" />)
    const textAreaWithErrorMessage = screen.getByRole('combobox', {
      description: 'Invoerfout:Test error message',
      name: 'label',
    })

    expect(textAreaWithErrorMessage).toBeInTheDocument()
  })

  it('marks the Field and input as invalid when there is an error message', () => {
    const { container } = render(<SourceField {...defaultProps} errorMessage="Test error message" />)

    const field = container.firstChild
    expect(field).toHaveClass('ams-field--invalid')

    const input = screen.getByRole('combobox', { name: 'label' })
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })
})
