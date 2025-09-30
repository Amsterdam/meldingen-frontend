import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'

import { FileUpload } from './FileUpload'

// TODO: Anything to do with DataTransfer is not currently tested, because DataTransfer is not mocked in jsdom.

describe('FileUpload', () => {
  it('renders button and texts', () => {
    render(<FileUpload onChange={vi.fn()} buttonText="Button text" dropAreaText="Drop area text" />)

    const button = screen.getByRole('button', { name: 'Drop area text Button text' })

    expect(button).toBeInTheDocument()
  })

  it('prevents default on drop', () => {
    const onChange = vi.fn()

    render(<FileUpload onChange={onChange} />)

    const button = screen.getByRole('button')

    // fireEvent.drop does not call onChange, so we must call the handler directly
    const event = new Event('drop', { bubbles: true, cancelable: true })
    event.preventDefault = vi.fn()
    button.dispatchEvent(event)

    expect(event.preventDefault).toHaveBeenCalled()
  })

  it('prevents default on drag over', () => {
    const onChange = vi.fn()

    render(<FileUpload onChange={onChange} />)

    const button = screen.getByRole('button')

    const event = new Event('dragover', { bubbles: true, cancelable: true })
    event.preventDefault = vi.fn()
    button.dispatchEvent(event)

    expect(event.preventDefault).toHaveBeenCalled()
  })

  it('calls click on file input when button is clicked', async () => {
    const user = userEvent.setup()

    const onChange = vi.fn()

    render(<FileUpload onChange={onChange} />)

    const input = screen.getByLabelText('File input')
    const button = screen.getByRole('button')

    // Spy on the input's click method
    const clickSpy = vi.spyOn(input, 'click')

    await user.click(button)

    expect(clickSpy).toHaveBeenCalled()
  })

  it('supports ref in React', () => {
    const ref = createRef<HTMLInputElement>()

    render(<FileUpload ref={ref} />)

    const input = screen.getByLabelText('File input')

    expect(ref.current).toBe(input)
  })
})
