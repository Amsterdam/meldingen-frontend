import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { MeldingContext } from '../../../../context/MeldingContextProvider'
import { server } from '../../../../mocks/node'

import { FileUpload } from './FileUpload'

describe('FileUpload Component', () => {
  it('renders the drop area text', () => {
    render(<FileUpload id="test" />)

    const buttonText = screen.getByText('Selecteer bestanden')
    const dropAreaText = screen.getByText('Of sleep de bestanden in dit vak.')

    expect(buttonText).toBeInTheDocument()
    expect(dropAreaText).toBeInTheDocument()
  })

  it('uploads multiple files', async () => {
    const user = userEvent.setup()

    render(<FileUpload id="test" />)

    const fileInput = screen.getByLabelText(/Selecteer bestanden/i) as HTMLInputElement

    const file = new File(['dummy content'], 'example.png', { type: 'image/png' })
    const file2 = new File(['dummy content two'], 'hoi.png', { type: 'image/png' })

    await user.upload(fileInput, [file, file2])

    expect(fileInput.files).toHaveLength(2)
  })

  it('uploads a file and displays name', async () => {
    const user = userEvent.setup()

    const mockContextValue = {
      data: {
        id: 2,
        token: 'test',
        classification: 1,
      },
      setData: () => {},
    }

    render(
      <MeldingContext.Provider value={mockContextValue}>
        <FileUpload id="test" />
      </MeldingContext.Provider>,
    )

    const fileInput = screen.getByLabelText(/Selecteer bestanden/i) as HTMLInputElement

    const file = new File(['dummy content'], 'example.png', { type: 'image/png' })

    await user.upload(fileInput, file)

    expect(fileInput.files).toHaveLength(1)

    expect(screen.getByText('example.png')).toBeInTheDocument()
  })
})
