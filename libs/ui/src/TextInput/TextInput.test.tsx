import { render, screen } from '@testing-library/react'
import { createRef } from 'react'

import { TextInput } from './TextInput'

describe('TextInput', () => {
  it('renders a text input', () => {
    render(<TextInput />)

    const input = screen.getByRole('textbox')

    expect(input).toBeInTheDocument()
  })

  it('renders the correct class', () => {
    render(<TextInput />)

    const input = screen.getByRole('textbox')

    expect(input).toHaveClass(/input/)
  })

  it('renders an extra class when provided', () => {
    render(<TextInput className="extra-class" />)

    const input = screen.getByRole('textbox')

    expect(input).toHaveClass('extra-class')
  })

  it('forwards extra props to the input', () => {
    render(<TextInput data-test="test" />)

    const input = screen.getByRole('textbox')

    expect(input).toHaveAttribute('data-test', 'test')
  })

  it('supports ForwardRef in React', () => {
    const ref = createRef<HTMLInputElement>()

    render(<TextInput ref={ref} />)

    const component = screen.getByRole('textbox')

    expect(ref.current).toBe(component)
  })
})
