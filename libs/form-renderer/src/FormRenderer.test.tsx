import { render, screen } from '@testing-library/react'

import { FormRenderer } from './FormRenderer'
import mockFormData from './mocks/mockFormData.json'

describe('FormRenderer', () => {
  it('renders a form', () => {
    const { container } = render(<FormRenderer formData={mockFormData.components[0].components} />)

    const form = container.querySelector('form')

    expect(form).toBeInTheDocument()
  })

  it('renders a TextInput', () => {
    render(<FormRenderer formData={mockFormData.components[0].components} />)

    const textInput = screen.getByRole('textbox', { name: mockFormData.components[0].components[0].label })

    expect(textInput).toBeInTheDocument()
  })

  it('renders a TextArea', () => {
    render(<FormRenderer formData={mockFormData.components[0].components} />)

    const textArea = screen.getByRole('textbox', { name: mockFormData.components[0].components[1].label })

    expect(textArea).toBeInTheDocument()
  })

  it('renders a Checkbox group', () => {
    render(<FormRenderer formData={mockFormData.components[0].components} />)

    const checkboxGroup = screen.getByRole('group', { name: mockFormData.components[0].components[2].label })

    expect(checkboxGroup).toBeInTheDocument()
  })

  it('renders a Select', () => {
    render(<FormRenderer formData={mockFormData.components[0].components} />)

    const select = screen.getByRole('combobox', { name: mockFormData.components[0].components[3].label })

    expect(select).toBeInTheDocument()
  })

  it('renders a Radio group', () => {
    render(<FormRenderer formData={mockFormData.components[0].components} />)

    const radioGroup = screen.getByRole('radiogroup', { name: mockFormData.components[0].components[4].label })

    expect(radioGroup).toBeInTheDocument()
  })
})
