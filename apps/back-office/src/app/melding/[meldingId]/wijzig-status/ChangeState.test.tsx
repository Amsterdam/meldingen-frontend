import type { Mock } from 'vitest'

import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useActionState } from 'react'

import { ChangeState } from './ChangeState'

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...(typeof actual === 'object' ? actual : {}),
    useActionState: vi.fn().mockReturnValue([{}, vi.fn(), false]),
  }
})

const defaultProps = {
  meldingId: 123,
  meldingState: 'processing',
  possibleStates: ['processing_requested', 'completed'],
  publicId: 'ABC',
}

describe('ChangeState', () => {
  it('renders the component with the correct document title', () => {
    render(<ChangeState {...defaultProps} />)

    expect(document.title).toBe('metadata.title')
  })

  it('renders the back link', () => {
    render(<ChangeState {...defaultProps} />)

    const backLink = screen.getByRole('link', { name: 'back-link' })
    expect(backLink).toBeInTheDocument()
    expect(backLink).toHaveAttribute('href', '/melding/123')
  })

  it('renders the component with the correct title', () => {
    render(<ChangeState {...defaultProps} />)

    expect(screen.getByRole('heading', { name: 'title' })).toBeInTheDocument()
  })

  it('renders the select field with the correct options', () => {
    render(<ChangeState {...defaultProps} />)

    expect(screen.getByRole('combobox', { name: 'label' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'state.processing' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'state.processing_requested' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'state.completed' })).toBeInTheDocument()
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

  it('displays the correct error message, document title and default value when the action returns an error with type invalid-state', () => {
    ;(useActionState as Mock).mockReturnValueOnce([
      { apiError: { type: 'invalid-state' }, meldingStateFromAction: 'completed' },
      vi.fn(),
      false,
    ])

    const { container } = render(<ChangeState {...defaultProps} />)

    const select = screen.getByRole('combobox', { name: 'label' })
    const alert = container.querySelector('.ams-alert')
    const heading = within(alert as HTMLElement).getByRole('heading', { name: 'errors.invalid-state.heading' })

    // Alert
    expect(alert).toBeInTheDocument()
    expect(heading).toBeInTheDocument()
    expect(alert).toHaveTextContent('errors.invalid-state.description')

    // Doc title
    expect(document.title).toBe('errors.invalid-state.heading - metadata.title')

    // Select
    expect(select).toHaveValue('completed')
  })

  it('displays the correct error message, document title and default value when the action returns an error with type state-change-failed', () => {
    ;(useActionState as Mock).mockReturnValueOnce([
      { apiError: { type: 'state-change-failed' }, meldingStateFromAction: 'completed' },
      vi.fn(),
      false,
    ])

    const { container } = render(<ChangeState {...defaultProps} />)

    const select = screen.getByRole('combobox', { name: 'label' })
    const alert = container.querySelector('.ams-alert')
    const heading = within(alert as HTMLElement).getByRole('heading', { name: 'errors.state-change-failed.heading' })

    // Alert
    expect(alert).toBeInTheDocument()
    expect(heading).toBeInTheDocument()
    expect(alert).toHaveTextContent('errors.state-change-failed.description')

    // Doc title
    expect(document.title).toBe('errors.state-change-failed.heading - metadata.title')

    // Select
    expect(select).toHaveValue('completed')
  })

  it('submits the form when the submit button is clicked', async () => {
    const user = userEvent.setup()

    const mockFormAction = vi.fn()
    ;(useActionState as Mock).mockReturnValueOnce([{}, mockFormAction, false])

    render(<ChangeState {...defaultProps} />)

    const submitButton = screen.getByRole('button', { name: 'submit-button' })
    await user.click(submitButton)

    expect(mockFormAction).toHaveBeenCalled()
  })
})
