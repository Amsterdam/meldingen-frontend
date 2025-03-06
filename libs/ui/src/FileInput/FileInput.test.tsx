import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { FileInput } from './FileInput'
import type { Props } from './FileInput'

const mockHandleOnChange = vi.fn()

const defaultProps: Props = {
  onChange: mockHandleOnChange,
  id: 'file-upload',
}

describe('FileInput Component', () => {
  it('renders the drop area text', () => {
    render(<FileInput {...defaultProps} />)

    const buttonText = screen.getByText('Selecteer bestanden')
    const dropAreaText = screen.getByText('Of sleep de bestanden in dit vak.')

    expect(buttonText).toBeInTheDocument()
    expect(dropAreaText).toBeInTheDocument()
  })

  it('uploads multiple files', async () => {
    const user = userEvent.setup()

    render(<FileInput {...defaultProps} />)

    const fileInput = screen.getByLabelText(/Selecteer bestanden/i) as HTMLInputElement

    const file = new File(['dummy content'], 'example.png', { type: 'image/png' })
    const file2 = new File(['dummy content two'], 'hoi.png', { type: 'image/png' })

    await user.upload(fileInput, [file, file2])

    expect(fileInput.files).toHaveLength(2)
    expect(mockHandleOnChange).toHaveBeenCalledTimes(1)
  })
})
