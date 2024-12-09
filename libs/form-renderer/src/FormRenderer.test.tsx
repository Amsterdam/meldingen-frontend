import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { FormRenderer } from './FormRenderer'
import mockFormData from './mocks/mockFormData.json'

describe('FormRenderer', () => {
  it('renders a form', () => {
    const onSubmitMock = vi.fn()

    const { container } = render(
      <FormRenderer formData={mockFormData.components[0].components} onSubmit={onSubmitMock} />,
    )

    const form = container.querySelector('form')

    expect(form).toBeInTheDocument()
  })

  it('renders a TextInput', () => {
    const onSubmitMock = vi.fn()

    render(<FormRenderer formData={mockFormData.components[0].components} onSubmit={onSubmitMock} />)

    const textInput = screen.getByRole('textbox', { name: mockFormData.components[0].components[0].label })

    expect(textInput).toBeInTheDocument()
  })

  it('renders a TextArea', () => {
    const onSubmitMock = vi.fn()

    render(<FormRenderer formData={mockFormData.components[0].components} onSubmit={onSubmitMock} />)

    const textArea = screen.getByRole('textbox', { name: mockFormData.components[0].components[1].label })

    expect(textArea).toBeInTheDocument()
  })

  it('renders a Checkbox group', () => {
    const onSubmitMock = vi.fn()

    render(<FormRenderer formData={mockFormData.components[0].components} onSubmit={onSubmitMock} />)

    const checkboxGroup = screen.getByRole('group', { name: mockFormData.components[0].components[2].label })

    expect(checkboxGroup).toBeInTheDocument()
  })

  it('renders a Select', () => {
    const onSubmitMock = vi.fn()

    render(<FormRenderer formData={mockFormData.components[0].components} onSubmit={onSubmitMock} />)

    const select = screen.getByRole('combobox', { name: mockFormData.components[0].components[3].label })

    expect(select).toBeInTheDocument()
  })

  it('renders a Radio group', () => {
    const onSubmitMock = vi.fn()

    render(<FormRenderer formData={mockFormData.components[0].components} onSubmit={onSubmitMock} />)

    const radioGroup = screen.getByRole('radiogroup', { name: mockFormData.components[0].components[4].label })

    expect(radioGroup).toBeInTheDocument()
  })

  it('renders nothing if an unsupported component is passed', () => {
    const onSubmitMock = vi.fn()

    const unsupportedComponentMock = [
      {
        ...mockFormData.components[0].components[0],
        type: 'unsupported',
      },
    ]

    const { container } = render(<FormRenderer formData={unsupportedComponentMock} onSubmit={onSubmitMock} />)

    const component = container.querySelector('input, textarea')

    expect(component).not.toBeInTheDocument()
  })

  it('renders a submit button', () => {
    const onSubmitMock = vi.fn()

    render(<FormRenderer formData={mockFormData.components[0].components} onSubmit={onSubmitMock} />)

    const submitButton = screen.getByRole('button', { name: 'Volgende vraag' })

    expect(submitButton).toBeInTheDocument()
  })

  it('calls the onSubmit function when the form is submitted', async () => {
    const onSubmitMock = vi.fn((e) => e.preventDefault())
    const user = userEvent.setup()

    render(<FormRenderer formData={mockFormData.components[0].components} onSubmit={onSubmitMock} />)

    const submitButton = screen.getByRole('button', { name: 'Volgende vraag' })

    await user.click(submitButton)

    expect(onSubmitMock).toHaveBeenCalled()
  })
})
