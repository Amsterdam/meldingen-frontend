import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'

import { ENDPOINTS } from 'apps/public/src/mocks/endpoints'
import { server } from 'apps/public/src/mocks/node'

import { FileList } from './FileList'
import type { Props } from './FileList'

const defaultProps: Props = {
  meldingId: 1,
  setUploadedFiles: vi.fn(),
  token: '1234',
  uploadedFiles: [
    {
      id: 128,
      created_at: '2025-02-24T14:05:10.073937',
      updated_at: '2025-02-24T14:05:10.073937',
      original_filename: 'Screenshot 2023-02-07 at 11.54.54.png',
      image: 'blob:http://localhost:3000/cbab3228-3ac6-4b30-9875-4b932ff0eb12',
    },
    {
      id: 127,
      created_at: '2025-02-24T14:05:10.125044',
      updated_at: '2025-02-24T14:05:10.125044',
      original_filename: 'Screenshot 2024-10-14 at 14.46.08.png',
      image: 'blob:http://localhost:3000/3e5ead56-1606-49fb-985f-861adadb241a',
    },
  ],
  setErrorMessage: vi.fn(),
}

describe('FileList', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  it('should render uploaded files', () => {
    render(<FileList {...defaultProps} />)

    const file1 = screen.getByText('Screenshot 2023-02-07 at 11.54.54.png')
    const file2 = screen.getByText('Screenshot 2024-10-14 at 14.46.08.png')
    const images = screen.getAllByRole('presentation', { name: '' })

    expect(file1).toBeInTheDocument()
    expect(file2).toBeInTheDocument()
    expect(images.length).toEqual(2)
  })

  it('should delete file', async () => {
    const user = userEvent.setup()

    render(<FileList {...defaultProps} />)

    const file1 = screen.getByText('Screenshot 2023-02-07 at 11.54.54.png')
    const file2 = screen.getByText('Screenshot 2024-10-14 at 14.46.08.png')

    expect(file1).toBeInTheDocument()
    expect(file2).toBeInTheDocument()

    const deleteButtons = screen.getAllByRole('button')

    await user.click(deleteButtons[0])

    expect(defaultProps.setUploadedFiles).toHaveBeenCalled()
  })

  it('should show an error message', async () => {
    server.use(http.delete(ENDPOINTS.MELDING_ATTACHMENT_DELETE_BY_ID, () => HttpResponse.error()))
    const user = userEvent.setup()

    render(<FileList {...defaultProps} />)

    const file1 = screen.getByText('Screenshot 2023-02-07 at 11.54.54.png')
    const file2 = screen.getByText('Screenshot 2024-10-14 at 14.46.08.png')

    expect(file1).toBeInTheDocument()
    expect(file2).toBeInTheDocument()

    const deleteButtons = screen.getAllByRole('button')

    await user.click(deleteButtons[0])

    expect(defaultProps.setUploadedFiles).not.toHaveBeenCalled()
    expect(defaultProps.setErrorMessage).toHaveBeenCalled()
  })
})
