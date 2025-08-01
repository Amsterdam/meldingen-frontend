import { render, screen } from '@testing-library/react'

import { FormRenderer, type Props } from './FormRenderer'
import { form } from './mocks/data'

const defaultProps: Props = {
  action: vi.fn(),
  formComponents: form.components[0].components,
  panelLabel: form.components[0].label,
  submitButtonText: 'Volgende vraag',
}

describe('FormRenderer', () => {
  it('renders a heading if there is more than one form component', () => {
    render(<FormRenderer {...defaultProps} />)

    const heading = screen.getByRole('heading', { name: form.components[0].label })

    expect(heading).toBeInTheDocument()
  })

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

  it('renders a TextInput with a heading if there is only 1 TextInput', () => {
    const props: Props = {
      ...defaultProps,
      formComponents: [form.components[0].components[0]],
    }

    render(<FormRenderer {...props} />)

    const heading = screen.getByRole('heading', { name: form.components[0].components[0].label })

    expect(heading).toBeInTheDocument()
  })

  it('renders a TextArea with a heading if there is only 1 TextArea', () => {
    const props: Props = {
      ...defaultProps,
      formComponents: [form.components[0].components[1]],
    }

    render(<FormRenderer {...props} />)

    const heading = screen.getByRole('heading', { name: form.components[0].components[1].label })

    expect(heading).toBeInTheDocument()
  })

  it('renders a Checkbox group with a heading if there is only 1 Checkbox group', () => {
    const props: Props = {
      ...defaultProps,
      formComponents: [form.components[0].components[2]],
    }

    render(<FormRenderer {...props} />)

    const heading = screen.getByRole('heading', { name: form.components[0].components[2].label })

    expect(heading).toBeInTheDocument()
  })

  it('renders a Select with a heading if there is only 1 Select', () => {
    const props: Props = {
      ...defaultProps,
      formComponents: [form.components[0].components[3]],
    }

    render(<FormRenderer {...props} />)

    const heading = screen.getByRole('heading', { name: form.components[0].components[3].label })

    expect(heading).toBeInTheDocument()
  })

  it('renders a Radio group  with a heading if there is only 1 Radio group', () => {
    const props: Props = {
      ...defaultProps,
      formComponents: [form.components[0].components[4]],
    }

    render(<FormRenderer {...props} />)

    const heading = screen.getByRole('heading', { name: form.components[0].components[4].label })

    expect(heading).toBeInTheDocument()
  })
})
