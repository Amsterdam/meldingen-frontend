import { render, screen } from '@testing-library/react'

import '@testing-library/jest-dom'
import { FileUpload } from './file-upload'

describe('FileUpload Component', () => {
  it('renders the drop area text', () => {
    render(<FileUpload />)

    const buttonText = screen.getByText('Selecteer bestanden')
    const dropAreaText = screen.getByText('Of sleep de bestanden in dit vak.')
    expect(buttonText).toBeInTheDocument()
    expect(dropAreaText).toBeInTheDocument()
  })
})
