import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'

import { ENDPOINTS } from 'apps/public/src/mocks/endpoints'
import { server } from 'apps/public/src/mocks/node'

import { Attachments } from './Attachments'

const defaultProps = {
  meldingId: 1,
  token: 'mock-token',
}

describe('Attachments', () => {
  beforeAll(() => {
    global.URL.createObjectURL = vi.fn(() => 'mocked-url')
  })

  it('should render correctly', () => {
    render(<Attachments {...defaultProps} />)

    const backLink = screen.getByRole('link', { name: 'back-link' })
    const header = screen.getByRole('heading', { name: 'step.title' })
    const fileUpload = screen.getByLabelText(/file-input.button/i)

    expect(backLink).toBeInTheDocument()
    expect(header).toBeInTheDocument()
    expect(fileUpload).toBeInTheDocument()
  })

  it('should show file names when a file is uploaded', async () => {
    const user = userEvent.setup()

    render(<Attachments {...defaultProps} />)

    const fileInput = screen.getByLabelText(/file-input.button/i) as HTMLInputElement

    const file = new File(['dummy content'], 'Screenshot 2025-02-10 at 08.29.41.png', { type: 'image/png' })
    const file2 = new File(['dummy content two'], 'hoi.png', { type: 'image/png' })

    await user.upload(fileInput, [file, file2])

    const fileName1 = screen.getByText('Screenshot 2025-02-10 at 08.29.41.png')
    const fileName2 = screen.getByText('hoi.png')

    expect(fileName1).toBeInTheDocument()
    expect(fileName2).toBeInTheDocument()
  })

  it('should delete a file with the delete button', async () => {
    const user = userEvent.setup()

    render(<Attachments {...defaultProps} />)

    const fileInput = screen.getByLabelText(/file-input.button/i) as HTMLInputElement

    const file = new File(['dummy content'], 'Screenshot 2025-02-10 at 08.29.41.png', { type: 'image/png' })

    await user.upload(fileInput, [file])

    const fileName1 = screen.getByText('Screenshot 2025-02-10 at 08.29.41.png')

    expect(fileName1).toBeInTheDocument()

    const deleteButton = screen.getByRole('button', { name: 'Verwijder' })

    await user.click(deleteButton)

    const file1SecondRender = screen.queryByText('Screenshot 2025-02-10 at 08.29.41.png')

    expect(file1SecondRender).not.toBeInTheDocument()
  })

  it('should throw an error when delete request fails', async () => {
    server.use(http.delete(ENDPOINTS.MELDING_ATTACHMENT_DELETE_BY_ID, () => HttpResponse.error()))
    const user = userEvent.setup()

    render(<Attachments {...defaultProps} />)

    const fileInput = screen.getByLabelText(/file-input.button/i) as HTMLInputElement

    const file = new File(['dummy content'], 'Screenshot 2025-02-10 at 08.29.41.png', { type: 'image/png' })

    await user.upload(fileInput, [file])

    const fileName1 = screen.getByText('Screenshot 2025-02-10 at 08.29.41.png')

    expect(fileName1).toBeInTheDocument()

    const deleteButton = screen.getByRole('button', { name: 'Verwijder' })

    await user.click(deleteButton)

    const file1SecondRender = screen.getByText('Screenshot 2025-02-10 at 08.29.41.png')
    const errorMessage = screen.getByText('Failed to fetch')

    expect(file1SecondRender).toBeInTheDocument()
    expect(errorMessage).toBeInTheDocument()
  })

  it('should show an error when post fails', async () => {
    server.use(http.post(ENDPOINTS.MELDING_ATTACHMENT_BY_ID, () => HttpResponse.error()))

    const user = userEvent.setup()

    render(<Attachments {...defaultProps} />)

    const fileInput = screen.getByLabelText(/file-input.button/i) as HTMLInputElement

    const file = new File(['dummy content'], 'Screenshot 2025-02-10 at 08.29.41.png', { type: 'image/png' })

    await user.upload(fileInput, [file])

    const errorMessage = screen.getByText('Failed to fetch')

    expect(errorMessage).toBeInTheDocument()
  })

  it('should throw an error when attempting to upload too many files', async () => {
    const user = userEvent.setup()

    render(<Attachments {...defaultProps} />)

    const fileInput = screen.getByLabelText(/file-input.button/i) as HTMLInputElement

    const file = new File(['dummy content'], 'example.png', { type: 'image/png' })
    const file2 = new File(['dummy content two'], 'example2.png', { type: 'image/png' })
    const file3 = new File(['dummy content three'], 'example3.png', { type: 'image/png' })
    const file4 = new File(['dummy content four'], 'example4.png', { type: 'image/png' })

    await user.upload(fileInput, [file, file2, file3, file4])

    const errorMessage = screen.getByText('errors.too-many-files')

    expect(errorMessage).toBeInTheDocument()
    expect(screen.queryByText('example.png')).not.toBeInTheDocument()
    expect(screen.queryByText('example2.png')).not.toBeInTheDocument()
    expect(screen.queryByText('example3.png')).not.toBeInTheDocument()
    expect(screen.queryByText('example4.png')).not.toBeInTheDocument()
  })
})
