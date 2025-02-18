import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { Mock } from 'vitest'

import { uploadFiles } from './actions'
import { Bijlage } from './Bijlage'

vi.mock('./actions', () => ({
  uploadFiles: vi.fn().mockImplementation(() => [
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
  ]),
  redirectToNextPage: vi.fn(),
}))

describe('Bijlage', () => {
  it('should render correctly', () => {
    render(<Bijlage />)

    const backLink = screen.getByRole('link', { name: 'Vorige vraag' })
    const header = screen.getByRole('heading', { name: 'Foto’s' })
    const fileUpload = screen.getByLabelText(/Selecteer bestanden/i)

    expect(backLink).toBeInTheDocument()
    expect(header).toBeInTheDocument()
    expect(fileUpload).toBeInTheDocument()
  })

  it('should show file names when files are uploaded', async () => {
    const user = userEvent.setup()

    render(<Bijlage />)

    const fileInput = screen.getByLabelText(/Selecteer bestanden/i) as HTMLInputElement

    const file = new File(['dummy content'], 'Screenshot 2025-02-10 at 08.29.41.png', { type: 'image/png' })
    const file2 = new File(['dummy content two'], 'Screenshot 2025-02-10 at 15.47.24.png', { type: 'image/png' })

    await user.upload(fileInput, [file, file2])

    const fileName1 = screen.getByText('Screenshot 2025-02-10 at 08.29.41.png')
    const fileName2 = screen.getByText('Screenshot 2025-02-10 at 15.47.24.png')

    expect(fileName1).toBeInTheDocument()
    expect(fileName2).toBeInTheDocument()
  })

  it.only('should render an error message', async () => {
    // @ts-expect-error unknown type error
    ;(uploadFiles as Mock<typeof uploadFiles>).mockReturnValueOnce({ message: 'Something bad happened' })

    const user = userEvent.setup()

    render(<Bijlage />)

    const fileInput = screen.getByLabelText(/Selecteer bestanden/i) as HTMLInputElement

    const file = new File(['dummy content'], 'Screenshot 2025-02-10 at 08.29.41.png', { type: 'image/png' })
    const file2 = new File(['dummy content two'], 'Screenshot 2025-02-10 at 15.47.24.png', { type: 'image/png' })

    await user.upload(fileInput, [file, file2])

    const errorMessage = screen.getByText('Something bad happened')

    expect(errorMessage).toBeInTheDocument()
  })
})
