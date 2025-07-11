import { render, screen } from '@testing-library/react'

import { FormRenderer, type Props } from './FormRenderer'
import { form } from './mocks/data'

const defaultProps: Props = {
  action: vi.fn(),
  formComponents: form.components[0].components,
  submitButtonText: 'Volgende vraag',
}

describe('FormRenderer', () => {
  it('renders a form', () => {
    const { container } = render(<FormRenderer {...defaultProps} />)

    const form = container.querySelector('form')

    expect(form).toBeInTheDocument()
  })

  it('renders a TextInput', () => {
    render(<FormRenderer {...defaultProps} />)

    const textInput = screen.getByRole('textbox', { name: form.components[0].components[0].label })

    expect(textInput).toBeInTheDocument()
  })

  it('renders a TextArea', () => {
    render(<FormRenderer {...defaultProps} />)

    const textArea = screen.getByRole('textbox', { name: form.components[0].components[1].label })

    expect(textArea).toBeInTheDocument()
  })

  it('renders a Checkbox group', () => {
    render(<FormRenderer {...defaultProps} />)

    const checkboxGroup = screen.getByRole('group', { name: form.components[0].components[2].label })

    expect(checkboxGroup).toBeInTheDocument()
  })

  it('renders a Select', () => {
    render(<FormRenderer {...defaultProps} />)

    const select = screen.getByRole('combobox', { name: form.components[0].components[3].label })

    expect(select).toBeInTheDocument()
  })

  it('renders a Radio group', () => {
    render(<FormRenderer {...defaultProps} />)

    const radioGroup = screen.getByRole('radiogroup', { name: form.components[0].components[4].label })

    expect(radioGroup).toBeInTheDocument()
  })

  it('renders nothing if an unsupported component is passed', () => {
    const props: Props = {
      ...defaultProps,
      formComponents: [
        {
          ...form.components[0].components[0],
          type: 'unsupported',
        },
      ],
    }

    const { container } = render(<FormRenderer {...props} />)

    const component = container.querySelector('input, textarea')

    expect(component).not.toBeInTheDocument()
  })

  it('renders a submit button', () => {
    render(<FormRenderer {...defaultProps} />)

    const submitButton = screen.getByRole('button', { name: 'Volgende vraag' })

    expect(submitButton).toBeInTheDocument()
  })
})
