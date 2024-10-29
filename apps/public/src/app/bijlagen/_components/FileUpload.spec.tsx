import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'

import { FileUpload } from './FileUpload'

describe('FileUpload Component', () => {
  it('renders the drop area text', () => {
    render(<FileUpload />)

    const buttonText = screen.getByText('Selecteer bestanden')
    const dropAreaText = screen.getByText('Of sleep de bestanden in dit vak.')

    expect(buttonText).toBeInTheDocument()
    expect(dropAreaText).toBeInTheDocument()
  })

  it('uploads a file ', async () => {
    render(<FileUpload />)

    const fileInput = screen.getByLabelText('file-input') as HTMLInputElement
    const file = new File(['dummy content'], 'example.png', { type: 'image/png' })

    await userEvent.upload(fileInput, file)

    expect(fileInput.files).toHaveLength(1)
  })

  it('uploads multiple files', async () => {
    render(<FileUpload />)

    const fileInput = screen.getByLabelText('file-input') as HTMLInputElement
    const file = new File(['dummy content'], 'example.png', { type: 'image/png' })
    const file2 = new File(['dummy content two'], 'hoi.png', { type: 'image/png' })

    await userEvent.upload(fileInput, [file, file2])

    expect(fileInput.files).toHaveLength(2)
  })
})
