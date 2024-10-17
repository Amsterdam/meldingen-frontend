import { render, screen } from '@testing-library/react'

import '@testing-library/jest-dom'
import { FileUpload } from './file-upload'

describe('FileUpload Component', () => {
  it('renders the file upload button', () => {
    render(<FileUpload />)
    const buttonElement = screen.getByText(/Selecteer bestanden/i)
    expect(buttonElement).toBeInTheDocument()
  })

  it('renders the drop area text', () => {
    render(<FileUpload />)
    const dropAreaText = screen.getByText(/Of sleep de bestanden in dit vak./i)
    expect(dropAreaText).toBeInTheDocument()
  })
})
