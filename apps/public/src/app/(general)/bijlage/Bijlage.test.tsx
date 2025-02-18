import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Bijlage } from './Bijlage'

vi.mock('./actions', () => ({
  redirectToNextPage: vi.fn(),
}))

const defaultProps = {
  meldingId: 1,
  token: 'mock-token',
}

describe('Bijlage', () => {
  it('should render correctly', () => {
    render(<Bijlage {...defaultProps} />)

    const backLink = screen.getByRole('link', { name: 'Vorige vraag' })
    const header = screen.getByRole('heading', { name: 'Foto’s' })
    const fileUpload = screen.getByLabelText(/Selecteer bestanden/i)

    expect(backLink).toBeInTheDocument()
    expect(header).toBeInTheDocument()
    expect(fileUpload).toBeInTheDocument()
  })

  it('should show file names when a file is uploaded', async () => {
    const user = userEvent.setup()

    render(<Bijlage {...defaultProps} />)

    const fileInput = screen.getByLabelText(/Selecteer bestanden/i) as HTMLInputElement

    const file = new File(['dummy content'], 'Screenshot 2025-02-10 at 08.29.41.png', { type: 'image/png' })

    await user.upload(fileInput, [file])

    const fileName1 = screen.getByText('Screenshot 2025-02-10 at 08.29.41.png')

    expect(fileName1).toBeInTheDocument()
  })
})
