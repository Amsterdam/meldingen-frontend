import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { useActionState } from 'react'
import { Mock } from 'vitest'

import { Attachments } from './Attachments'
import * as utils from './utils'
import { textAreaComponent } from 'apps/melding-form/src/mocks/data'
import { ENDPOINTS } from 'apps/melding-form/src/mocks/endpoints'
import { server } from 'apps/melding-form/src/mocks/node'

const defaultProps = {
  meldingId: 1,
  token: 'mock-token',
  formData: [{ ...textAreaComponent, description: 'Test description' }],
}

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...(typeof actual === 'object' ? actual : {}),
    useActionState: vi.fn().mockReturnValue([{}, vi.fn()]),
  }
})

global.URL.createObjectURL = vi.fn()
global.URL.revokeObjectURL = vi.fn()

vi.mock('@amsterdam/design-system-react/dist/common/useIsAfterBreakpoint', () => ({
  default: vi.fn(),
}))

const mockFile = new File(['dummy content'], 'example.png', { type: 'image/png' })

describe('Attachments', () => {
  it('renders correctly', () => {
    render(<Attachments {...defaultProps} />)

    const backLink = screen.getByRole('link', { name: 'back-link' })
    const header = screen.getByRole('banner', { name: 'title' })
    const heading = screen.getByRole('heading', { name: 'First question hint-text' })
    const description = screen.getByText('Test description')
    const fileUpload = screen.getByRole('button', {
      name: 'First question hint-text file-upload.drop-area file-upload.button',
    })

    expect(backLink).toBeInTheDocument()
    expect(header).toBeInTheDocument()
    expect(heading).toBeInTheDocument()
    expect(description).toBeInTheDocument()
    expect(fileUpload).toBeInTheDocument()
  })

  it('shows file names when a file is uploaded', async () => {
    const user = userEvent.setup()

    render(<Attachments {...defaultProps} />)

    const fileInput = screen.getByLabelText('File input')

    const file = mockFile
    const file2 = new File(['dummy content two'], 'hoi.png', { type: 'image/png' })

    await user.upload(fileInput, [file, file2])

    const fileName1 = screen.getAllByText(mockFile.name)[0]
    const fileName2 = screen.getAllByText('hoi.png')[0]

    expect(fileName1).toBeInTheDocument()
    expect(fileName2).toBeInTheDocument()
  })

  it('does not upload files when there are no files to upload', () => {
    render(<Attachments {...defaultProps} />)

    const fileInput = screen.getByLabelText('File input')

    fireEvent.change(fileInput, { target: { files: null } })

    const fileList = screen.queryByRole('list')

    expect(fileList).not.toBeInTheDocument()
  })

  it('shows an error when startUpload sets status to error', async () => {
    const user = userEvent.setup()

    const spy = vi.spyOn(utils, 'startUpload').mockImplementationOnce((_xhr, fileUpload, setFileUploads) => {
      setFileUploads((prev) =>
        prev.map((upload) =>
          upload.id === fileUpload.id ? { ...upload, status: 'error', error: 'Upload failed' } : upload,
        ),
      )
    })

    render(<Attachments {...defaultProps} />)

    const fileInput = screen.getByLabelText('File input')

    await user.upload(fileInput, [mockFile])

    expect(screen.getByText('Upload failed')).toBeInTheDocument()

    spy.mockRestore()
  })

  it('deletes a succesfully uploaded file with the delete button', async () => {
    const user = userEvent.setup()

    const xhrMock: Partial<XMLHttpRequest> = { readyState: XMLHttpRequest.DONE }

    const spy = vi.spyOn(utils, 'startUpload').mockImplementationOnce((_xhr, fileUpload, setFileUploads) => {
      setFileUploads((prev) =>
        prev.map((upload) =>
          upload.id === fileUpload.id ? { ...upload, xhr: xhrMock as XMLHttpRequest, serverId: 123 } : upload,
        ),
      )
    })

    render(<Attachments {...defaultProps} />)

    const fileInput = screen.getByLabelText('File input')

    await user.upload(fileInput, [mockFile])

    const fileName1 = screen.getAllByText(mockFile.name)[0]

    expect(fileName1).toBeInTheDocument()

    const deleteButton = screen.getByRole('button', { name: `Verwijder ${mockFile.name}` })

    await user.click(deleteButton)

    const file1SecondRender = screen.queryByText(mockFile.name)

    expect(file1SecondRender).not.toBeInTheDocument()

    spy.mockRestore()
  })

  it('deletes a pending upload and removes it from the file list with the delete button', async () => {
    const user = userEvent.setup()

    const abortMock = vi.fn()

    const xhrMock: Partial<XMLHttpRequest> = { readyState: XMLHttpRequest.OPENED, abort: abortMock }

    const spy = vi.spyOn(utils, 'startUpload').mockImplementationOnce((_xhr, fileUpload, setFileUploads) => {
      setFileUploads((prev) =>
        prev.map((upload) =>
          upload.id === fileUpload.id ? { ...upload, xhr: xhrMock as XMLHttpRequest, serverId: 123 } : upload,
        ),
      )
    })

    render(<Attachments {...defaultProps} />)

    const fileInput = screen.getByLabelText('File input')

    await user.upload(fileInput, [mockFile])

    const deleteButton = screen.getByRole('button', { name: `Verwijder ${mockFile.name}` })

    await user.click(deleteButton)

    const fileName = screen.queryByText(mockFile.name)

    expect(fileName).not.toBeInTheDocument()
    expect(abortMock).toHaveBeenCalled()

    spy.mockRestore()
  })

  it('removes a failed upload from the file list with the delete button', async () => {
    const user = userEvent.setup()

    const xhrMock: Partial<XMLHttpRequest> = { readyState: XMLHttpRequest.DONE }

    const spy = vi.spyOn(utils, 'startUpload').mockImplementationOnce((_xhr, fileUpload, setFileUploads) => {
      setFileUploads((prev) =>
        prev.map((upload) =>
          upload.id === fileUpload.id ? { ...upload, xhr: xhrMock as XMLHttpRequest, serverId: undefined } : upload,
        ),
      )
    })

    render(<Attachments {...defaultProps} />)

    const fileInput = screen.getByLabelText('File input')

    await user.upload(fileInput, [mockFile])

    const deleteButton = screen.getByRole('button', { name: `Verwijder ${mockFile.name}` })

    await user.click(deleteButton)

    const fileName = screen.queryByText(mockFile.name)

    expect(fileName).not.toBeInTheDocument()

    spy.mockRestore()
  })

  it('should throw an error when delete request fails', async () => {
    server.use(
      http.delete(
        ENDPOINTS.DELETE_MELDING_BY_MELDING_ID_ATTACHMENT_BY_ATTACHMENT_ID,
        () => new HttpResponse(null, { status: 404 }),
      ),
    )

    const user = userEvent.setup()

    const xhrMock: Partial<XMLHttpRequest> = { readyState: XMLHttpRequest.DONE }

    const spy = vi.spyOn(utils, 'startUpload').mockImplementationOnce((_xhr, fileUpload, setFileUploads) => {
      setFileUploads((prev) =>
        prev.map((upload) =>
          upload.id === fileUpload.id ? { ...upload, xhr: xhrMock as XMLHttpRequest, serverId: 123 } : upload,
        ),
      )
    })

    render(<Attachments {...defaultProps} />)

    const fileInput = screen.getByLabelText('File input')

    await user.upload(fileInput, [mockFile])

    const deleteButton = screen.getByRole('button', { name: `Verwijder ${mockFile.name}` })

    await user.click(deleteButton)

    const fileName = screen.getAllByText(mockFile.name)[0]
    const errorMessage = screen.getByText('An unknown error occurred')

    expect(fileName).toBeInTheDocument()
    expect(errorMessage).toBeInTheDocument()

    spy.mockRestore()
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
