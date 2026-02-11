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
  possibleStates: ['awaiting_processing', 'completed'],
  publicId: 'ABC',
}

describe('ChangeState', () => {
  it('renders the select field with the correct options', () => {
    render(<ChangeState {...defaultProps} />)

    expect(screen.getByRole('combobox', { name: 'label' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'state.processing' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'state.awaiting_processing' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'state.completed' })).toBeInTheDocument()
  })

  it('renders the back link', () => {
    render(<ChangeState {...defaultProps} />)

    const backLink = screen.getByRole('link', { name: 'back-link' })
    expect(backLink).toBeInTheDocument()
    expect(backLink).toHaveAttribute('href', '/melding/123')
  })

  it('renders the cancel link', () => {
    render(<ChangeState {...defaultProps} />)

    const cancelLink = screen.getByRole('link', { name: 'cancel-link' })
    expect(cancelLink).toBeInTheDocument()
    expect(cancelLink).toHaveAttribute('href', '/melding/123')
  })

  it('sets the default value of the select field if melding state is valid', () => {
    render(<ChangeState {...defaultProps} />)

    const select = screen.getByRole('combobox', { name: 'label' })
    expect(select).toHaveValue('processing')
  })

  it('displays the correct error message when the action returns an error with type invalid-state', () => {
    ;(useActionState as Mock).mockReturnValue([{ error: { type: 'invalid-state' } }, vi.fn()])

    render(<ChangeState {...defaultProps} />)

    expect(screen.getByText('errors.invalid-state.heading')).toBeInTheDocument()
    expect(screen.getByText('errors.invalid-state.description')).toBeInTheDocument()
  })

  it('displays the correct error message when the action returns an error with type state-change-failed', () => {
    ;(useActionState as Mock).mockReturnValue([{ error: { type: 'state-change-failed' } }, vi.fn()])

    render(<ChangeState {...defaultProps} />)

    expect(screen.getByText('errors.state-change-failed.heading')).toBeInTheDocument()
    expect(screen.getByText('errors.state-change-failed.description')).toBeInTheDocument()
  })
})
