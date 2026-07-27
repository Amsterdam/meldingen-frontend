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
    useActionState: vi.fn().mockReturnValue([{}, vi.fn(), false]),
  }
})

const defaultProps: Props = {
  currentUrgency: 0,
  meldingId: 123,
  publicId: 'ABC',
}

describe('ChangeUrgency', () => {
  it('renders the component with the correct document title', () => {
    render(<ChangeUrgency {...defaultProps} />)

    expect(document.title).toBe('metadata.title')
  })

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

  it('displays the correct error message, document title and selected urgency when action returns invalid-urgency', () => {
    ;(useActionState as Mock).mockReturnValueOnce([
      { apiError: { type: 'invalid-urgency' }, urgencyFromAction: '1' },
      vi.fn(),
      false,
    ])

    const { container } = render(<ChangeUrgency {...defaultProps} />)

    const alert = container.querySelector('.ams-alert')
    const heading = within(alert as HTMLElement).getByRole('heading', { name: 'errors.invalid-urgency.heading' })

    // Alert
    expect(alert).toBeInTheDocument()
    expect(heading).toBeInTheDocument()
    expect(alert).toHaveTextContent('errors.invalid-urgency.description')

    // Doc title
    expect(document.title).toBe('errors.invalid-urgency.heading - metadata.title')

    // Radio
    expect(screen.getByRole('radio', { name: 'urgency.1' })).toBeChecked()
  })

  it('displays the correct error message, document title and selected urgency when action returns urgency-change-failed', () => {
    ;(useActionState as Mock).mockReturnValueOnce([
      { apiError: { type: 'urgency-change-failed' }, urgencyFromAction: '-1' },
      vi.fn(),
      false,
    ])

    const { container } = render(<ChangeUrgency {...defaultProps} />)

    const alert = container.querySelector('.ams-alert')
    const heading = within(alert as HTMLElement).getByRole('heading', { name: 'errors.urgency-change-failed.heading' })

    // Alert
    expect(alert).toBeInTheDocument()
    expect(heading).toBeInTheDocument()
    expect(alert).toHaveTextContent('errors.urgency-change-failed.description')

    // Doc title
    expect(document.title).toBe('errors.urgency-change-failed.heading - metadata.title')

    // Radio
    expect(screen.getByRole('radio', { name: 'urgency.-1' })).toBeChecked()
  })

  it('submits the form when the submit button is clicked', async () => {
    const user = userEvent.setup()

    const mockFormAction = vi.fn()
    ;(useActionState as Mock).mockReturnValueOnce([{}, mockFormAction, false])

    render(<ChangeUrgency {...defaultProps} />)

    const submitButton = screen.getByRole('button', { name: 'submit-button' })
    await user.click(submitButton)

    expect(mockFormAction).toHaveBeenCalled()
  })
})
