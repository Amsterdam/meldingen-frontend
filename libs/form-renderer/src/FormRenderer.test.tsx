import { render, screen } from '@testing-library/react'

import { FormRenderer, type Props } from './FormRenderer'
import { form } from './mocks/data'

const defaultProps: Props = {
  action: vi.fn(),
  formComponents: form.components[0].components,
  panelLabel: form.components[0].label,
  submitButtonText: 'Volgende vraag',
}

const components = [
  { index: 0, name: 'TextInput', role: 'textbox' },
  { index: 1, name: 'TextArea', role: 'textbox' },
  { index: 2, name: 'CheckboxGroup', role: 'group' },
  { index: 3, name: 'Select', role: 'combobox' },
  { index: 4, name: 'RadioGroup', role: 'radiogroup' },
]

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

  components.map(({ name, index, role }) => {
    it(`renders a ${name}`, () => {
      render(<FormRenderer {...defaultProps} />)

      const component = screen.getByRole(role, { name: form.components[0].components[index].label })

      expect(component).toBeInTheDocument()
    })
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

  components.map(({ name, index }) => {
    it(`renders a ${name} with a heading if there is only 1 ${name}`, () => {
      const props: Props = {
        ...defaultProps,
        formComponents: [form.components[0].components[index]],
      }

      render(<FormRenderer {...props} />)

      const heading = screen.getByRole('heading', { name: form.components[0].components[index].label })

      expect(heading).toBeInTheDocument()
    })
  })

  components.map(({ name, index, role }) => {
    if (name !== 'CheckboxGroup') {
      it(`renders a ${name} with an error when there is one`, () => {
        render(
          <FormRenderer
            {...defaultProps}
            validationErrors={[{ key: form.components[0].components[index].key, message: 'Test error message' }]}
          />,
        )

        const components = screen.getByRole(role, {
          name: form.components[0].components[index].label,
          description: 'Invoerfout: Test error message',
        })

        expect(components).toBeInTheDocument()
      })
    } else {
      // Because of an NVDA bug, we need to add the description and error to the label
      it(`renders a CheckboxGroup with an error when there is one`, () => {
        render(
          <FormRenderer
            {...defaultProps}
            validationErrors={[{ key: form.components[0].components[index].key, message: 'Test error message' }]}
          />,
        )

        const components = screen.getByRole(role, {
          name: `${form.components[0].components[index].label} Invoerfout: Test error message`,
        })

        expect(components).toBeInTheDocument()
      })
    }
  })
})
