import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { useActionState } from 'react'
import { Mock } from 'vitest'

import { Attachments } from './Attachments'
import { textAreaComponent } from 'apps/melding-form/src/mocks/data'
import { ENDPOINTS } from 'apps/melding-form/src/mocks/endpoints'
import { server } from 'apps/melding-form/src/mocks/node'

const defaultProps = {
  meldingId: 1,
  token: 'mock-token',
  formData: [textAreaComponent],
}

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...(typeof actual === 'object' ? actual : {}),
    useActionState: vi.fn().mockReturnValue([{}, vi.fn()]),
  }
})

global.URL.createObjectURL = vi.fn()

vi.mock('@amsterdam/design-system-react/dist/common/useIsAfterBreakpoint', () => ({
  default: vi.fn(),
}))

describe('Attachments', () => {
  it('should render correctly', () => {
    render(<Attachments {...defaultProps} />)

    const backLink = screen.getByRole('link', { name: 'back-link' })
    const header = screen.getByRole('banner', { name: 'title' })
    const fileUpload = screen.getByRole('button', {
      name: 'First question hint-text file-upload.drop-area file-upload.button',
    })

    expect(backLink).toBeInTheDocument()
    expect(header).toBeInTheDocument()
    expect(fileUpload).toBeInTheDocument()
  })

  it('should show file names when a file is uploaded', async () => {
    const user = userEvent.setup()

    render(<Attachments {...defaultProps} />)

    const fileInput = screen.getByLabelText('File input')

    const file = new File(['dummy content'], 'Screenshot 2025-02-10 at 08.29.41.png', { type: 'image/png' })
    const file2 = new File(['dummy content two'], 'hoi.png', { type: 'image/png' })

    await user.upload(fileInput, [file, file2])

    const fileName1 = screen.getAllByText('Screenshot 2025-02-10 at 08.29.41.png')[0]
    const fileName2 = screen.getAllByText('hoi.png')[0]

    expect(fileName1).toBeInTheDocument()
    expect(fileName2).toBeInTheDocument()
  })

  it('should delete a file with the delete button', async () => {
    global.URL.revokeObjectURL = vi.fn()

    const user = userEvent.setup()

    render(<Attachments {...defaultProps} />)

    const fileInput = screen.getByLabelText('File input')

    const file = new File(['dummy content'], 'Screenshot 2025-02-10 at 08.29.41.png', { type: 'image/png' })

    await user.upload(fileInput, [file])

    const fileName1 = screen.getAllByText('Screenshot 2025-02-10 at 08.29.41.png')[0]

    expect(fileName1).toBeInTheDocument()

    const deleteButton = screen.getByRole('button', { name: 'Verwijder Screenshot 2025-02-10 at 08.29.41.png' })

    await user.click(deleteButton)

    const file1SecondRender = screen.queryByText('Screenshot 2025-02-10 at 08.29.41.png')

    expect(file1SecondRender).not.toBeInTheDocument()
  })

  it('should throw an error when delete request fails', async () => {
    server.use(
      http.delete(
        ENDPOINTS.DELETE_MELDING_BY_MELDING_ID_ATTACHMENT_BY_ATTACHMENT_ID,
        () => new HttpResponse(null, { status: 404 }),
      ),
    )
    const user = userEvent.setup()

    render(<Attachments {...defaultProps} />)

    const fileInput = screen.getByLabelText('File input')

    const file = new File(['dummy content'], 'Screenshot 2025-02-10 at 08.29.41.png', { type: 'image/png' })

    await user.upload(fileInput, [file])

    const fileName1 = screen.getAllByText('Screenshot 2025-02-10 at 08.29.41.png')[0]

    expect(fileName1).toBeInTheDocument()

    const deleteButton = screen.getByRole('button', { name: 'Verwijder Screenshot 2025-02-10 at 08.29.41.png' })

    await user.click(deleteButton)

    const file1SecondRender = screen.getAllByText('Screenshot 2025-02-10 at 08.29.41.png')[0]
    const errorMessage = screen.getByText('An unknown error occurred')

    expect(file1SecondRender).toBeInTheDocument()
    expect(errorMessage).toBeInTheDocument()
  })

  it('should show an error when post fails', async () => {
    server.use(http.post(ENDPOINTS.POST_MELDING_BY_MELDING_ID_ATTACHMENT, () => HttpResponse.error()))

    const user = userEvent.setup()

    render(<Attachments {...defaultProps} />)

    const fileInput = screen.getByLabelText('File input')

    const file = new File(['dummy content'], 'Screenshot 2025-02-10 at 08.29.41.png', { type: 'image/png' })

    await user.upload(fileInput, [file])

    const errorMessage = screen.getByText('Failed to fetch')

    expect(errorMessage).toBeInTheDocument()
  })

  it('should throw an error when attempting to upload too many files', async () => {
    const user = userEvent.setup()

    render(<Attachments {...defaultProps} />)

    const fileInput = screen.getByLabelText('File input')

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

  it('renders a system error Alert when there is one', () => {
    ;(useActionState as Mock).mockReturnValue([{ systemError: 'Test error message' }, vi.fn()])

    render(<Attachments {...defaultProps} />)

    const alert = screen.getByRole('alert')

    expect(alert).toHaveTextContent('system-error-alert-title')
  })
})
