import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import type { Props } from './TextArea'

import { TextArea } from './TextArea'

const validate = {
  json: {},
  required: false,
  required_error_message: null,
}

const defaultProps: Props = {
  hasHeading: true,
  id: 'test-id',
  label: 'Test label',
  validate,
}

describe('TextArea Component', () => {
  it('renders the TextArea component', () => {
    render(<TextArea {...defaultProps} />)

    const textArea = screen.getByRole('textbox', { name: `${defaultProps.label} (niet verplicht)` })

    expect(textArea).toBeInTheDocument()
  })

  it('renders a description', () => {
    render(<TextArea {...defaultProps} description="Test description" />)

    const textAreaWithDescription = screen.getByRole('textbox', {
      description: 'Test description',
      name: `${defaultProps.label} (niet verplicht)`,
    })

    expect(textAreaWithDescription).toBeInTheDocument()
  })

  it('renders a character count', () => {
    const propsWithMaxLength: Props = {
      ...defaultProps,
      validate: {
        ...defaultProps.validate,
        maxLength: 100,
        maxLengthErrorMessage: 'You have exceeded the maximum length.',
      },
    }

    render(<TextArea {...propsWithMaxLength} />)

    const characterCount = screen.getByRole('status')

    expect(characterCount).toBeInTheDocument()
  })

  it('counts the number of characters', async () => {
    const propsWithMaxLength: Props = {
      ...defaultProps,
      validate: {
        ...defaultProps.validate,
        maxLength: 80,
        maxLengthErrorMessage: 'You have exceeded the maximum length.',
      },
    }

    const user = userEvent.setup()

    render(<TextArea {...propsWithMaxLength} />)

    const textArea = screen.getByRole('textbox', { name: `${defaultProps.label} (niet verplicht)` })

    await user.type(textArea, '0123456789')

    const characterCount = screen.getByRole('status')

    expect(characterCount).toHaveTextContent('10 van 80 tekens')
  })

  it('counts the length of defaultValue if supplied', () => {
    const propsWithMaxLength: Props = {
      ...defaultProps,
      validate: {
        ...defaultProps.validate,
        maxLength: 100,
        maxLengthErrorMessage: 'You have exceeded the maximum length.',
      },
    }

    render(<TextArea {...propsWithMaxLength} defaultValue="Test" />)

    const characterCount = screen.getByRole('status')

    expect(characterCount).toHaveTextContent('4 van 100 tekens')
  })

  it('correctly marks TextArea as required', () => {
    const propsWithRequiredTextArea: Props = {
      ...defaultProps,
      validate: {
        ...defaultProps.validate,
        required: true,
      },
    }

    render(<TextArea {...propsWithRequiredTextArea} />)

    const textArea = screen.getByRole('textbox', { name: defaultProps.label })

    expect(textArea).toBeRequired()
  })

  it('renders a heading if hasHeading is true', () => {
    render(<TextArea {...defaultProps} />)

    const heading = screen.getByRole('heading', { name: `${defaultProps.label} (niet verplicht)` })

    expect(heading).toBeInTheDocument()
  })

  it('does not render a heading if hasHeading is false', () => {
    render(<TextArea {...defaultProps} hasHeading={false} />)

    const heading = screen.queryByRole('heading')

    expect(heading).not.toBeInTheDocument()
  })

  it('renders an error message when there is one', () => {
    render(<TextArea {...defaultProps} errorMessage="Test error message" />)

    const textAreaWithErrorMessage = screen.getByRole('textbox', {
      description: 'Invoerfout:Test error message',
      name: `${defaultProps.label} (niet verplicht)`,
    })

    expect(textAreaWithErrorMessage).toBeInTheDocument()
  })

  it('marks the Field and input as invalid when there is an error message', () => {
    const { container } = render(<TextArea {...defaultProps} errorMessage="Test error message" />)

    const field = container.firstChild
    expect(field).toHaveClass('ams-field--invalid')

    const input = screen.getByRole('textbox', { name: `${defaultProps.label} (niet verplicht)` })
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })
})
