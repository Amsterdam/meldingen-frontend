import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { FormRenderer } from './FormRenderer'
import mockFormData from './mocks/mockFormData.json'

describe('FormRenderer', () => {
  it('renders a form', () => {
    const action = vi.fn()

    const { container } = render(<FormRenderer formData={mockFormData.components[0].components} action={action} />)

    const form = container.querySelector('form')

    expect(form).toBeInTheDocument()
  })

  it('renders a TextInput', () => {
    const action = vi.fn()

    render(<FormRenderer formData={mockFormData.components[0].components} action={action} />)

    const textInput = screen.getByRole('textbox', { name: mockFormData.components[0].components[0].label })

    expect(textInput).toBeInTheDocument()
  })

  it('renders a TextArea', () => {
    const action = vi.fn()

    render(<FormRenderer formData={mockFormData.components[0].components} action={action} />)

    const textArea = screen.getByRole('textbox', { name: mockFormData.components[0].components[1].label })

    expect(textArea).toBeInTheDocument()
  })

  it('renders a Checkbox group', () => {
    const action = vi.fn()

    render(<FormRenderer formData={mockFormData.components[0].components} action={action} />)

    const checkboxGroup = screen.getByRole('group', { name: mockFormData.components[0].components[2].label })

    expect(checkboxGroup).toBeInTheDocument()
  })

  it('renders a Select', () => {
    const action = vi.fn()

    render(<FormRenderer formData={mockFormData.components[0].components} action={action} />)

    const select = screen.getByRole('combobox', { name: mockFormData.components[0].components[3].label })

    expect(select).toBeInTheDocument()
  })

  it('renders a Radio group', () => {
    const action = vi.fn()

    render(<FormRenderer formData={mockFormData.components[0].components} action={action} />)

    const radioGroup = screen.getByRole('radiogroup', { name: mockFormData.components[0].components[4].label })

    expect(radioGroup).toBeInTheDocument()
  })

  it('renders nothing if an unsupported component is passed', () => {
    const action = vi.fn()

    const unsupportedComponentMock = [
      {
        ...mockFormData.components[0].components[0],
        type: 'unsupported',
      },
    ]

    const { container } = render(<FormRenderer formData={unsupportedComponentMock} action={action} />)

    const component = container.querySelector('input, textarea')

    expect(component).not.toBeInTheDocument()
  })

  it('renders a submit button', () => {
    const action = vi.fn()

    render(<FormRenderer formData={mockFormData.components[0].components} action={action} />)

    const submitButton = screen.getByRole('button', { name: 'Volgende vraag' })

    expect(submitButton).toBeInTheDocument()
  })
})
