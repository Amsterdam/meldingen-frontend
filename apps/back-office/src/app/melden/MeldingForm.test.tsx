import type { Mock } from 'vitest'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useActionState } from 'react'

import type { StaticFormTextAreaComponentOutput } from '@meldingen/api-client'

import { MeldingForm } from './MeldingForm'

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...(typeof actual === 'object' ? actual : {}),
    useActionState: vi.fn().mockReturnValue([{}, vi.fn()]),
  }
})

const defaultProps = {
  labels: [
    { created_at: '2024-01-01', id: 1, name: 'Label 1', updated_at: '2024-01-01' },
    { created_at: '2024-01-02', id: 2, name: 'Label 2', updated_at: '2024-01-02' },
  ],
  primaryTextArea: { description: 'Some description', label: 'Some label' } as StaticFormTextAreaComponentOutput,
  sources: [
    { created_at: '2024-01-01', id: 1, name: 'Source 1', updated_at: '2024-01-01' },
    { created_at: '2024-01-02', id: 2, name: 'Source 2', updated_at: '2024-01-02' },
  ],
}

describe('MeldingForm', () => {
  it('renders', () => {
    render(<MeldingForm {...defaultProps} />)

    const heading = screen.getByRole('heading', { name: 'visually-hidden-title' })
    const input = screen.getByRole('textbox', { name: 'Some label' })
    const description = screen.getByText('Some description')
    const submitButton = screen.getByRole('button', { name: 'submit-button' })

    expect(heading).toBeInTheDocument()
    expect(input).toBeInTheDocument()
    expect(description).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()
  })

  it('sets focus on SystemErrorAlert when there is a system error', () => {
    ;(useActionState as Mock).mockReturnValue([{ systemError: 'Test error message' }, vi.fn()])

    render(<MeldingForm {...defaultProps} />)

    const alert = screen.getByRole('alert')

    expect(alert).toHaveFocus()
  })

  it('renders an Invalid Form Alert when there are validation errors', () => {
    ;(useActionState as Mock).mockReturnValueOnce([
      { validationErrors: [{ key: 'key1', message: 'Test error message' }] },
      vi.fn(),
    ])

    render(<MeldingForm {...defaultProps} />)

    const link = screen.getByRole('link', { name: 'Test error message' })

    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '#key1')
  })

  it('sets focus on InvalidFormAlert when there are validation errors', () => {
    ;(useActionState as Mock).mockReturnValue([
      { validationErrors: [{ key: 'key1', message: 'Test error message' }] },
      vi.fn(),
    ])

    const { container } = render(<MeldingForm {...defaultProps} />)

    const alert = container.querySelector('.ams-alert')

    expect(alert).toHaveFocus()
  })

  it('renders an error message connected to the primary text area when there is a validation error for the primary field', () => {
    ;(useActionState as Mock).mockReturnValueOnce([
      { validationErrors: [{ key: 'primary', message: 'Primary field error' }] },
      vi.fn(),
    ])

    render(<MeldingForm {...defaultProps} />)

    const input = screen.getByRole('textbox', { name: 'Some label' })

    expect(input).toHaveAccessibleDescription('Some description Invoerfout:Primary field error')
  })

  it('prefills the text area from formData when the action returns formData', () => {
    const formData = new FormData()
    formData.set('primary', 'Prefilled text')
    ;(useActionState as Mock).mockReturnValueOnce([{ formData }, vi.fn()])

    render(<MeldingForm {...defaultProps} />)

    expect(screen.getByRole('textbox')).toHaveValue('Prefilled text')
  })

  it('prefills the text area from defaultValues when provided and there is no formData', () => {
    render(<MeldingForm {...defaultProps} defaultValues={{ primary: 'Default value' }} />)

    expect(screen.getByRole('textbox')).toHaveValue('Default value')
  })

  it('falls back to an empty text area when there is no formData and no defaultValues', () => {
    render(<MeldingForm {...defaultProps} />)

    expect(screen.getByRole('textbox')).toHaveValue('')
  })

  it('renders an error message connected to the source select input when there is a validation error for the source field', () => {
    ;(useActionState as Mock).mockReturnValueOnce([
      { validationErrors: [{ key: 'source', message: 'Source field error' }] },
      vi.fn(),
    ])

    render(<MeldingForm {...defaultProps} />)

    const input = screen.getByRole('combobox', { name: 'label' })

    expect(input).toHaveAccessibleDescription('Invoerfout:Source field error')
  })

  it('prefills the source select input from formData when the action returns formData', () => {
    const formData = new FormData()
    formData.set('source', '2')
    ;(useActionState as Mock).mockReturnValueOnce([{ formData }, vi.fn()])

    render(<MeldingForm {...defaultProps} />)

    expect(screen.getByRole('combobox', { name: 'label' })).toHaveValue('2')
  })

  it('prefills the source select input from defaultValues when provided and there is no formData', () => {
    render(<MeldingForm {...defaultProps} defaultValues={{ source: '1' }} />)

    expect(screen.getByRole('combobox', { name: 'label' })).toHaveValue('1')
  })

  it('falls back to an empty source select input when there is no formData and no defaultValues', () => {
    render(<MeldingForm {...defaultProps} />)

    expect(screen.getByRole('combobox', { name: 'label' })).toHaveValue('')
  })

  it('prefills urgency from formData when the action returns formData', () => {
    const formData = new FormData()
    formData.set('urgency', '1')
    ;(useActionState as Mock).mockReturnValueOnce([{ formData }, vi.fn()])

    render(<MeldingForm {...defaultProps} />)

    expect(screen.getByRole('radio', { name: 'urgency.1' })).toBeChecked()
  })

  it('prefills urgency from defaultValues when provided and there is no formData', () => {
    render(<MeldingForm {...defaultProps} defaultValues={{ urgency: -1 }} />)

    expect(screen.getByRole('radio', { name: 'urgency.-1' })).toBeChecked()
  })

  it('falls back to "medium" urgency when there is no formData and no defaultValues', () => {
    render(<MeldingForm {...defaultProps} />)

    expect(screen.getByRole('radio', { name: 'urgency.0' })).toBeChecked()
  })

  it('prefills labels from formData when the action returns formData', () => {
    const formData = new FormData()
    formData.append('labels', '1')
    formData.append('labels', '2')
    ;(useActionState as Mock).mockReturnValueOnce([{ formData }, vi.fn()])

    render(<MeldingForm {...defaultProps} />)

    const option1 = screen.getByRole('checkbox', { name: 'Label 1' })
    const option2 = screen.getByRole('checkbox', { name: 'Label 2' })

    expect(option1).toBeChecked()
    expect(option2).toBeChecked()
  })

  it('prefills labels from defaultValues when provided and there is no formData', () => {
    render(<MeldingForm {...defaultProps} defaultValues={{ labels: [1] }} />)

    expect(screen.getByRole('checkbox', { name: 'Label 1' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Label 2' })).not.toBeChecked()
  })

  it('submits the form when the submit button is clicked', async () => {
    const user = userEvent.setup()
    const mockFormAction = vi.fn()
    ;(useActionState as Mock).mockReturnValue([{}, mockFormAction])

    render(<MeldingForm {...defaultProps} />)

    await user.click(screen.getByRole('button', { name: 'submit-button' }))

    expect(mockFormAction).toHaveBeenCalled()
  })

  it('shows the classification name after a successful API call', async () => {
    const user = userEvent.setup()

    render(<MeldingForm {...defaultProps} />)

    await user.type(screen.getByRole('textbox', { name: 'Some label' }), 'Hello world')
    await user.tab()

    await waitFor(() => {
      expect(screen.getByText('De categorie van de melding is: Test classification')).toBeInTheDocument()
    })
  })
})
