import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { TextArea } from './TextArea'

const requiredProps = {
  autoExpand: false,
  description: '',
  id: 'test-id',
  input: true,
  key: 'test-key',
  label: 'Test label',
  maxCharCount: null,
  position: 1,
  question: 1,
  type: '',
  validate: { required: true },
}

describe('TextArea Component', () => {
  it('renders the TextArea component', () => {
    render(<TextArea {...requiredProps} key={requiredProps.key} />)

    const textArea = screen.getByRole('textbox', { name: requiredProps.label })

    expect(textArea).toBeInTheDocument()
  })

  it('renders a description', () => {
    render(<TextArea {...requiredProps} key={requiredProps.key} description="Test description" />)

    const textAreaWithDescription = screen.getByRole('textbox', {
      name: requiredProps.label,
      description: 'Test description',
    })

    expect(textAreaWithDescription).toBeInTheDocument()
  })

  it('renders a character count', () => {
    render(<TextArea {...requiredProps} key={requiredProps.key} maxCharCount={80} />)

    const characterCount = screen.getByRole('status')

    expect(characterCount).toBeInTheDocument()
  })

  it('counts the number of characters', async () => {
    const user = userEvent.setup()

    render(<TextArea {...requiredProps} key={requiredProps.key} maxCharCount={80} />)

    const textArea = screen.getByRole('textbox', { name: requiredProps.label })

    await user.type(textArea, '0123456789')

    const characterCount = screen.getByRole('status')

    expect(characterCount).toHaveTextContent('10 van 80 tekens')
  })

  it('correctly marks TextArea as required', () => {
    render(<TextArea {...requiredProps} key={requiredProps.key} />)

    const textArea = screen.getByRole('textbox', { name: requiredProps.label })

    expect(textArea).toBeRequired()
  })

  it('correctly marks TextArea as not required', () => {
    render(<TextArea {...requiredProps} key={requiredProps.key} validate={{ required: false }} />)

    const textArea = screen.getByRole('textbox', { name: `${requiredProps.label} (niet verplicht)` })

    expect(textArea).toBeInTheDocument()
  })
})
