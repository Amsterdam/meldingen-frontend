import { render, screen, fireEvent } from '@testing-library/react'

import { TextArea } from './TextArea'

const requiredProps = { id: 'test-id', name: 'test-name', label: 'Test label' }

describe('TextArea Component', () => {
  test('renders the TextArea component', () => {
    render(<TextArea {...requiredProps} />)
    const textAreaElement = screen.getByRole('textbox', { name: requiredProps.label })
    expect(textAreaElement).toBeInTheDocument()
  })

  // test('calls onChange handler when text is entered', () => {
  //   const handleChange = jest.fn()
  //   render(<TextArea onChange={handleChange} />)
  //   const textAreaElement = screen.getByRole('textbox')
  //   fireEvent.change(textAreaElement, { target: { value: 'New text' } })
  //   expect(handleChange).toHaveBeenCalledTimes(1)
  // })
})
