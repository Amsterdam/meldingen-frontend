import { render, screen } from '@testing-library/react'
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
})
