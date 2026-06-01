import type { Mock } from 'vitest'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useActionState } from 'react'

import type { Props } from './ChangeLabels'

import { ChangeLabels } from './ChangeLabels'

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...(typeof actual === 'object' ? actual : {}),
    useActionState: vi.fn().mockReturnValue([{}, vi.fn()]),
  }
})

const defaultProps: Props = {
  currentLabelIds: [0, 1],
  labels: [
    { created_at: '2024-01-01T00:00:00Z', id: 0, name: 'Label 1', updated_at: '2024-01-01T00:00:00Z' },
    { created_at: '2024-01-01T00:00:00Z', id: 1, name: 'Label 2', updated_at: '2024-01-01T00:00:00Z' },
    { created_at: '2024-01-01T00:00:00Z', id: 2, name: 'Label 3', updated_at: '2024-01-01T00:00:00Z' },
  ],
  meldingId: 123,
  publicId: 'ABC',
}

describe('ChangeLabels', () => {
  it('renders the backlink', () => {
    render(<ChangeLabels {...defaultProps} />)

    const backLink = screen.getByRole('link', { name: 'back-link' })
    expect(backLink).toBeInTheDocument()
    expect(backLink).toHaveAttribute('href', '/melding/123')
  })

  it('renders the component with the correct title', () => {
    render(<ChangeLabels {...defaultProps} />)

    expect(screen.getByRole('heading', { name: 'title' })).toBeInTheDocument()
  })

  it('renders the checkbox options', () => {
    render(<ChangeLabels {...defaultProps} />)

    expect(screen.getByRole('group', { name: 'label' })).toBeInTheDocument()

    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes).toHaveLength(3)
    expect(checkboxes[0]).toHaveAccessibleName('Label 1')
    expect(checkboxes[1]).toHaveAccessibleName('Label 2')
    expect(checkboxes[2]).toHaveAccessibleName('Label 3')
  })

  it('renders the cancel link', () => {
    render(<ChangeLabels {...defaultProps} />)

    const cancelLink = screen.getByRole('link', { name: 'cancel-link' })

    expect(cancelLink).toBeInTheDocument()
    expect(cancelLink).toHaveAttribute('href', '/melding/123')
  })

  it('checks current label ids by default', () => {
    render(<ChangeLabels {...defaultProps} />)

    expect(screen.getByRole('checkbox', { name: 'Label 1' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Label 2' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Label 3' })).not.toBeChecked()
  })

  it('displays the an error message and last selected labels when action returns an error', () => {
    ;(useActionState as Mock).mockReturnValueOnce([{ error: 'Test error', labelIdsFromAction: [0, 2] }, vi.fn()])

    render(<ChangeLabels {...defaultProps} />)

    const alert = screen.getByRole('alert', { name: 'errors.labels-change-failed.heading' })
    expect(alert).toBeInTheDocument()
    expect(alert).toHaveTextContent('errors.labels-change-failed.description')

    expect(screen.getByRole('checkbox', { name: 'Label 1' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Label 3' })).toBeChecked()
  })

  it('uses labelIdsFromAction over currentLabelIds when both are present', () => {
    // currentLabelIds has labels 1 and 2, but the action returned only label 3
    ;(useActionState as Mock).mockReturnValueOnce([{ labelIdsFromAction: [2] }, vi.fn()])

    render(<ChangeLabels {...defaultProps} />)

    expect(screen.getByRole('checkbox', { name: 'Label 1' })).not.toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Label 2' })).not.toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Label 3' })).toBeChecked()
  })

  it('checks no checkboxes when both labelIdsFromAction and currentLabelIds are absent', () => {
    render(<ChangeLabels {...defaultProps} currentLabelIds={undefined} />)

    const checkboxes = screen.getAllByRole('checkbox')
    checkboxes.forEach((checkbox) => expect(checkbox).not.toBeChecked())
  })

  it('submits the form when the submit button is clicked', async () => {
    const user = userEvent.setup()

    const mockFormAction = vi.fn()
    ;(useActionState as Mock).mockReturnValueOnce([{}, mockFormAction])

    render(<ChangeLabels {...defaultProps} />)

    const submitButton = screen.getByRole('button', { name: 'submit-button' })
    await user.click(submitButton)

    expect(mockFormAction).toHaveBeenCalled()
  })
})
