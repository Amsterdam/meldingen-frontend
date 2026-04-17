import type { Mock } from 'vitest'

import { render, screen, within } from '@testing-library/react'
import { useActionState } from 'react'

import type { Props } from './AdditionalQuestions'

import { AdditionalQuestions } from './AdditionalQuestions'
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
  panelTitle: 'Test title',
  previousAnswersByKey: {},
  previousPanelPath: '/prev',
}

describe('AdditionalQuestions', () => {
  it('uses the component label in the document title when there is only one component', () => {
    render(<AdditionalQuestions {...defaultProps} />)

    expect(document.title).toBe(`${textAreaComponent.label} - organisation-name`)
  })

  it('uses the panel title in the document title when there are multiple components', () => {
    render(
      <AdditionalQuestions
        {...defaultProps}
        formComponents={[textAreaComponent, { ...textAreaComponent, key: 'textArea2', label: 'Second question' }]}
      />,
    )

    expect(document.title).toBe(`${defaultProps.panelTitle} - organisation-name`)
  })

  it('renders the back link', () => {
    render(<AdditionalQuestions {...defaultProps} />)

    const link = screen.getByRole('link', { name: 'back-link' })

    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/prev')
  })

  it('renders an Alert and keeps input data when there is an error message', () => {
    const formData = new FormData()

    formData.append('textArea1', 'Er staan blowende jongeren')
    ;(useActionState as Mock).mockReturnValueOnce([{ formData, systemError: 'Test error message' }, vi.fn()])

    render(<AdditionalQuestions {...defaultProps} />)

    const alert = screen.getByRole('alert')

    expect(alert).toHaveTextContent('system-error-alert-title')

    const input = screen.getByRole('textbox')

    expect(input).toHaveValue('Er staan blowende jongeren')
  })

  it('keeps input data on error for checkboxes', () => {
    const formData = new FormData()

    formData.append('checkbox___selectBoxes___one', 'one')
    ;(useActionState as Mock).mockReturnValueOnce([{ formData, systemError: 'Test error message' }, vi.fn()])

    render(<AdditionalQuestions {...defaultProps} formComponents={[checkboxComponent]} />)

    const alert = screen.getByRole('alert')

    expect(alert).toHaveTextContent('system-error-alert-title')

    const checkbox = screen.getByRole('checkbox', { name: 'One' })

    expect(checkbox).toBeChecked()
  })

  it('keeps input data on error for time inputs with a checked checkbox', () => {
    const formData = new FormData()

    formData.append('time___timeInput-unknown', 'on')
    ;(useActionState as Mock).mockReturnValueOnce([{ formData, systemError: 'Test error message' }, vi.fn()])

    render(
      <AdditionalQuestions
        {...defaultProps}
        formComponents={[{ ...textAreaComponent, key: 'timeInput', label: 'Time input', type: 'time' }]}
      />,
    )

    const timeInput = screen.getByLabelText('Tijdstip')
    const checkbox = screen.getByRole('checkbox', { name: 'Weet ik niet' })

    expect(timeInput).toHaveValue('')
    expect(checkbox).toBeChecked()
  })

  it('keeps input data on error for time input with a value', () => {
    const formData = new FormData()

    formData.append('time___timeInput', '10:30')
    ;(useActionState as Mock).mockReturnValueOnce([{ formData, systemError: 'Test error message' }, vi.fn()])

    render(
      <AdditionalQuestions
        {...defaultProps}
        formComponents={[{ ...textAreaComponent, key: 'timeInput', label: 'Time input', type: 'time' }]}
      />,
    )

    const timeInput = screen.getByLabelText('Tijdstip')

    expect(timeInput).toHaveValue('10:30')
  })

  it('falls back to the original component when it cannot be prefilled', () => {
    const formData = new FormData()

    ;(useActionState as Mock).mockReturnValueOnce([{ formData, systemError: 'Test error message' }, vi.fn()])

    render(<AdditionalQuestions {...defaultProps} formComponents={[{ ...textAreaComponent }]} />)

    const input = screen.getByRole('textbox', { name: 'First question (niet verplicht)' })

    expect(input).toHaveValue('')
  })

  it('renders an Invalid Form Alert when there are validation errors', () => {
    ;(useActionState as Mock).mockReturnValueOnce([
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

  it('renders a default value in the input when provided', () => {
    render(
      <AdditionalQuestions
        {...defaultProps}
        formComponents={[{ ...textAreaComponent, defaultValue: 'Default value from server' }]}
      />,
    )

    const input = screen.getByRole('textbox')

    expect(input).toHaveValue('Default value from server')
  })

  it('renders a default value in the input when provided for checkboxes', () => {
    render(
      <AdditionalQuestions {...defaultProps} formComponents={[{ ...checkboxComponent, defaultValues: ['two'] }]} />,
    )

    const checkbox1 = screen.getByRole('checkbox', { name: 'One' })
    const checkbox2 = screen.getByRole('checkbox', { name: 'Two' })

    expect(checkbox1).not.toBeChecked()
    expect(checkbox2).toBeChecked()
  })

  it('prioritizes form data returned by the action over the initial defaultValue', () => {
    const formData = new FormData()

    formData.append('textArea1', 'Form data from action')
    ;(useActionState as Mock).mockReturnValueOnce([{ formData }, vi.fn()])

    render(
      <AdditionalQuestions
        {...defaultProps}
        formComponents={[{ ...textAreaComponent, defaultValue: 'Default value from server' }]}
      />,
    )

    const input = screen.getByRole('textbox')

    expect(input).toHaveValue('Form data from action')
  })

  it('prioritizes form data returned by the action over the initial defaultValues for checkboxes', () => {
    const formData = new FormData()

    formData.append('checkbox___selectBoxes___one', 'one')
    ;(useActionState as Mock).mockReturnValueOnce([{ formData, systemError: 'Test error message' }, vi.fn()])

    render(
      <AdditionalQuestions {...defaultProps} formComponents={[{ ...checkboxComponent, defaultValues: ['two'] }]} />,
    )

    const checkbox1 = screen.getByRole('checkbox', { name: 'One' })
    const checkbox2 = screen.getByRole('checkbox', { name: 'Two' })

    expect(checkbox1).toBeChecked()
    expect(checkbox2).not.toBeChecked()
  })

  it('prefills Time Inputs with a checked checkbox', () => {
    const formData = new FormData()

    formData.append('time___timeInput-unknown', 'on')
    ;(useActionState as Mock).mockReturnValueOnce([{ formData }, vi.fn()])

    render(
      <AdditionalQuestions
        {...defaultProps}
        formComponents={[{ ...textAreaComponent, key: 'timeInput', label: 'Time input', type: 'time' }]}
      />,
    )

    const timeInputGroup = screen.getByRole('group', { name: 'Time input (niet verplicht)' })
    const checkbox = within(timeInputGroup).getByRole('checkbox', { name: 'Weet ik niet' })

    expect(checkbox).toBeChecked()
  })

  it('updates the document title when there is a system error', () => {
    ;(useActionState as Mock).mockReturnValueOnce([{ systemError: 'Test error message' }, vi.fn()])

    render(<AdditionalQuestions {...defaultProps} />)

    expect(document.title).toBe(`system-error-alert-title - ${textAreaComponent.label} - organisation-name`)
  })

  it('updates the document title when there are validation errors', () => {
    ;(useActionState as Mock).mockReturnValueOnce([
      { validationErrors: [{ key: 'key1', message: 'Test error message' }] },
      vi.fn(),
    ])

    render(<AdditionalQuestions {...defaultProps} />)

    expect(document.title).toBe(`error-count-label ${textAreaComponent.label} - organisation-name`)
  })

  it('sets focus on InvalidFormAlert when there are validation errors', () => {
    ;(useActionState as Mock).mockReturnValueOnce([
      { validationErrors: [{ key: 'key1', message: 'Test error message' }] },
      vi.fn(),
    ])

    const { container } = render(<AdditionalQuestions {...defaultProps} />)

    const alert = container.querySelector('.ams-alert')

    expect(alert).toHaveFocus()
  })

  it('sets focus on SystemErrorAlert when there is a system error', () => {
    ;(useActionState as Mock).mockReturnValueOnce([{ systemError: 'Test error message' }, vi.fn()])
    render(<AdditionalQuestions {...defaultProps} />)

    const alert = screen.getByRole('alert')

    expect(alert).toHaveFocus()
  })
})
