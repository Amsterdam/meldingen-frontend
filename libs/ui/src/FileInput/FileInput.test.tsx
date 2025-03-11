import { render, screen } from '@testing-library/react'

import { FileInput } from './FileInput'
import type { Props } from './FileInput'

const mockHandleOnChange = vi.fn()

const defaultProps: Props = {
  buttonText: 'Selecteer bestanden',
  dropAreaText: 'Of sleep de bestanden in dit vak.',
  id: 'file-upload',
  onChange: mockHandleOnChange,
}

describe('FileInput Component', () => {
  it('renders the drop area text', () => {
    render(<FileInput {...defaultProps} />)

    const buttonText = screen.getByText('Selecteer bestanden')
    const dropAreaText = screen.getByText('Of sleep de bestanden in dit vak.')

    expect(buttonText).toBeInTheDocument()
    expect(dropAreaText).toBeInTheDocument()
  })
})
