import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { FileInput } from './FileInput'

const mockHandleOnChange = vi.fn()

describe('FileInput Component', () => {
  it('renders the drop area text', () => {
    render(<FileInput id="test" handleOnChange={mockHandleOnChange} uploadedFiles={[]} />)

    const buttonText = screen.getByText('Selecteer bestanden')
    const dropAreaText = screen.getByText('Of sleep de bestanden in dit vak.')

    expect(buttonText).toBeInTheDocument()
    expect(dropAreaText).toBeInTheDocument()
  })

  it('uploads multiple files', async () => {
    const user = userEvent.setup()

    render(<FileInput id="test" handleOnChange={mockHandleOnChange} uploadedFiles={[]} />)

    const fileInput = screen.getByLabelText(/Selecteer bestanden/i) as HTMLInputElement

    const file = new File(['dummy content'], 'example.png', { type: 'image/png' })
    const file2 = new File(['dummy content two'], 'hoi.png', { type: 'image/png' })

    await user.upload(fileInput, [file, file2])

    expect(fileInput.files).toHaveLength(2)
    expect(mockHandleOnChange).toHaveBeenCalledTimes(1)
  })

  it('should render file names when files are uploaded', () => {
    render(
      <FileInput
        id="test"
        handleOnChange={mockHandleOnChange}
        uploadedFiles={[
          {
            id: 42,
            created_at: '2025-02-17T08:29:10.617091',
            updated_at: '2025-02-17T08:29:10.617091',
            original_filename: 'Screenshot 2025-02-10 at 08.29.41.png',
          },
          {
            id: 43,
            created_at: '2025-02-17T08:29:10.629835',
            updated_at: '2025-02-17T08:29:10.629835',
            original_filename: 'Screenshot 2025-02-10 at 15.47.24.png',
          },
        ]}
      />,
    )

    const fileName1 = screen.getByText('Screenshot 2025-02-10 at 08.29.41.png')
    const fileName2 = screen.getByText('Screenshot 2025-02-10 at 15.47.24.png')

    expect(fileName1).toBeInTheDocument()
    expect(fileName2).toBeInTheDocument()
  })
})
