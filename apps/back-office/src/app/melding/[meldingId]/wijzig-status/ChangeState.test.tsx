import { render, screen } from '@testing-library/react'
import { useActionState } from 'react'
import { Mock } from 'vitest'

import { ChangeState } from './ChangeState'

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...(typeof actual === 'object' ? actual : {}),
    useActionState: vi.fn().mockReturnValue([{}, vi.fn()]),
  }
})

const defaultProps = {
  meldingId: 123,
  meldingState: 'processing',
  publicId: 'ABC',
}

describe('ChangeState', () => {
  it('renders the select field with the correct options', () => {
    render(<ChangeState {...defaultProps} />)

    expect(screen.getByRole('combobox', { name: 'label' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'options.default' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'options.processing' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'options.completed' })).toBeInTheDocument()
  })

  it('renders the back link', () => {
    render(<ChangeState {...defaultProps} />)

    const backLink = screen.getByRole('link', { name: 'back-link' })
    expect(backLink).toBeInTheDocument()
    expect(backLink).toHaveAttribute('href', '/melding/123')
  })

  it('sets the default value of the select field if melding state is valid', () => {
    render(<ChangeState {...defaultProps} />)

    const select = screen.getByRole('combobox', { name: 'label' })
    expect(select).toHaveValue('processing')
  })

  it('does not set the default value of the select field if melding state is invalid', () => {
    const invalidProps = { ...defaultProps, meldingState: 'invalid' }

    render(<ChangeState {...invalidProps} />)

    const select = screen.getByRole('combobox', { name: 'label' })
    expect(select).toHaveValue('')
  })

  it('displays an error message when the action returns an error', () => {
    ;(useActionState as Mock).mockReturnValue([{ message: 'Error message' }, vi.fn()])

    render(<ChangeState {...defaultProps} />)

    expect(screen.getByText('Error message')).toBeInTheDocument()
  })
})
