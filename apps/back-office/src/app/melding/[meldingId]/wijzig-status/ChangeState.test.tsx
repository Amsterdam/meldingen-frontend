import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
  it('renders the component with the correct title', () => {
    render(<ChangeState {...defaultProps} />)

    expect(screen.getByRole('heading', { name: 'change-state.title' })).toBeInTheDocument()
  })

  it('renders the back link', () => {
    render(<ChangeState {...defaultProps} />)

    const backLink = screen.getByRole('link', { name: 'change-state.back-link' })
    expect(backLink).toBeInTheDocument()
    expect(backLink).toHaveAttribute('href', '/melding/123')
  })

  it('renders the select field with the correct options', () => {
    render(<ChangeState {...defaultProps} />)

    expect(screen.getByRole('combobox', { name: 'change-state.label' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'change-state.options.default' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'shared.state.processing' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'shared.state.completed' })).toBeInTheDocument()
  })

  it('sets the default value of the select field if melding state is valid', () => {
    render(<ChangeState {...defaultProps} />)

    const select = screen.getByRole('combobox', { name: 'change-state.label' })
    expect(select).toHaveValue('processing')
  })

  it('does not set the default value of the select field if melding state is invalid', () => {
    const invalidProps = { ...defaultProps, meldingState: 'invalid' }

    render(<ChangeState {...invalidProps} />)

    const select = screen.getByRole('combobox', { name: 'change-state.label' })
    expect(select).toHaveValue('')
  })

  it('displays an error message when the action returns an error', () => {
    ;(useActionState as Mock).mockReturnValue([{ errorMessage: 'Error message' }, vi.fn()])

    render(<ChangeState {...defaultProps} />)

    expect(screen.getByText('Error message')).toBeInTheDocument()
  })

  it('submits the form when the submit button is clicked', async () => {
    const user = userEvent.setup()

    const mockFormAction = vi.fn()
    ;(useActionState as Mock).mockReturnValue([{}, mockFormAction])

    render(<ChangeState {...defaultProps} />)

    const submitButton = screen.getByRole('button', { name: 'change-state.submit-button' })
    await user.click(submitButton)

    expect(mockFormAction).toHaveBeenCalled()
  })
})
