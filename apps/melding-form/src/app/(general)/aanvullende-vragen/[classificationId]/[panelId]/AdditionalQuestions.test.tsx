import { render, screen } from '@testing-library/react'
import { useActionState } from 'react'
import type { Mock } from 'vitest'

import { AdditionalQuestions, type Props } from './AdditionalQuestions'
import { checkboxComponent, textAreaComponent } from 'apps/melding-form/src/mocks/data'

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...(typeof actual === 'object' ? actual : {}),
    useActionState: vi.fn().mockReturnValue([{}, vi.fn()]),
  }
})

const defaultProps: Props = {
  action: vi.fn(),
  formComponents: [textAreaComponent],
  panelLabel: 'Test title',
  previousPanelPath: '/prev',
}

describe('AdditionalQuestions', () => {
  it('renders the back link', () => {
    render(<AdditionalQuestions {...defaultProps} />)

    const link = screen.getByRole('link', { name: 'back-link' })

    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/')
  })

  it('renders an Alert and keeps input data when there is an error message', () => {
    const formData = new FormData()

    formData.append('textArea1', 'Er staan blowende jongeren')
    ;(useActionState as Mock).mockReturnValue([{ formData, systemError: 'Test error message' }, vi.fn()])

    render(<AdditionalQuestions {...defaultProps} />)

    const alert = screen.getByRole('alert')

    expect(alert).toHaveTextContent('system-error-alert-title')

    const input = screen.getByRole('textbox')

    expect(input).toHaveValue('Er staan blowende jongeren')
  })

  it('keeps input data on error for checkboxes', () => {
    const formData = new FormData()

    formData.append('checkbox___selectBoxes___one', 'one')
    ;(useActionState as Mock).mockReturnValue([{ formData, systemError: 'Test error message' }, vi.fn()])

    render(<AdditionalQuestions {...defaultProps} formComponents={[checkboxComponent]} />)

    const alert = screen.getByRole('alert')

    expect(alert).toHaveTextContent('system-error-alert-title')

    const checkbox = screen.getByRole('checkbox', { name: 'One' })

    expect(checkbox).toBeChecked()
  })

  it('renders the form header', () => {
    render(<AdditionalQuestions {...defaultProps} />)

    const header = screen.getByRole('banner', { name: 'title' })

    expect(header).toBeInTheDocument()
  })

  it('renders an Invalid Form Alert when there are validation errors', () => {
    ;(useActionState as Mock).mockReturnValue([
      { validationErrors: [{ key: 'key1', message: 'Test error message' }] },
      vi.fn(),
    ])

    render(<AdditionalQuestions {...defaultProps} />)

    const link = screen.getByRole('link', { name: 'Test error message' })

    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '#key1')
  })

  it('renders form data', () => {
    render(<AdditionalQuestions {...defaultProps} />)

    const question = screen.getByRole('textbox', { name: /First question/ })

    expect(question).toBeInTheDocument()
  })
})
