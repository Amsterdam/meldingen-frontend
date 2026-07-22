import type { Mock } from 'vitest'

import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useActionState } from 'react'

import type { Props } from './ChangeUrgency'

import { ChangeUrgency } from './ChangeUrgency'

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...(typeof actual === 'object' ? actual : {}),
    useActionState: vi.fn().mockReturnValue([{}, vi.fn()]),
  }
})

const defaultProps: Props = {
  currentUrgency: 0,
  meldingId: 123,
  publicId: 'ABC',
}

describe('ChangeUrgency', () => {
  it('renders the backlink', () => {
    render(<ChangeUrgency {...defaultProps} />)

    const backLink = screen.getByRole('link', { name: 'back-link' })
    expect(backLink).toBeInTheDocument()
    expect(backLink).toHaveAttribute('href', '/melding/123')
  })

  it('renders the component with the correct title', () => {
    render(<ChangeUrgency {...defaultProps} />)

    expect(screen.getByRole('heading', { name: 'title' })).toBeInTheDocument()
  })

  it('renders the radio options', () => {
    render(<ChangeUrgency {...defaultProps} />)

    expect(screen.getByRole('radiogroup', { name: 'label' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'urgency.-1' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'urgency.0' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'urgency.1' })).toBeInTheDocument()
  })

  it('renders the cancel link', () => {
    render(<ChangeUrgency {...defaultProps} />)

    const cancelLink = screen.getByRole('link', { name: 'cancel-link' })

    expect(cancelLink).toBeInTheDocument()
    expect(cancelLink).toHaveAttribute('href', '/melding/123')
  })

  it('defaults to the current urgency', () => {
    render(<ChangeUrgency {...defaultProps} />)

    expect(screen.getByRole('radio', { name: 'urgency.0' })).toBeChecked()
  })

  it('displays the correct error message and selected urgency when action returns invalid-urgency', () => {
    ;(useActionState as Mock).mockReturnValue([
      { apiError: { type: 'invalid-urgency' }, urgencyFromAction: '1' },
      vi.fn(),
    ])

    const { container } = render(<ChangeUrgency {...defaultProps} />)

    const alert = container.querySelector('.ams-alert')
    const heading = within(alert as HTMLElement).getByRole('heading', { name: 'errors.invalid-urgency.heading' })

    expect(alert).toBeInTheDocument()
    expect(heading).toBeInTheDocument()
    expect(alert).toHaveTextContent('errors.invalid-urgency.description')
    expect(screen.getByRole('radio', { name: 'urgency.1' })).toBeChecked()
  })

  it('displays the correct error message and selected urgency when action returns urgency-change-failed', () => {
    ;(useActionState as Mock).mockReturnValue([
      { apiError: { type: 'urgency-change-failed' }, urgencyFromAction: '-1' },
      vi.fn(),
    ])

    const { container } = render(<ChangeUrgency {...defaultProps} />)

    const alert = container.querySelector('.ams-alert')
    const heading = within(alert as HTMLElement).getByRole('heading', { name: 'errors.urgency-change-failed.heading' })

    expect(alert).toBeInTheDocument()
    expect(heading).toBeInTheDocument()
    expect(alert).toHaveTextContent('errors.urgency-change-failed.description')
    expect(screen.getByRole('radio', { name: 'urgency.-1' })).toBeChecked()
  })

  it('submits the form when the submit button is clicked', async () => {
    const user = userEvent.setup()

    const mockFormAction = vi.fn()
    ;(useActionState as Mock).mockReturnValue([{}, mockFormAction])

    render(<ChangeUrgency {...defaultProps} />)

    const submitButton = screen.getByRole('button', { name: 'submit-button' })
    await user.click(submitButton)

    expect(mockFormAction).toHaveBeenCalled()
  })
})
