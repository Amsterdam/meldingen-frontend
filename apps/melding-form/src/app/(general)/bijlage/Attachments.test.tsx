import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { useActionState } from 'react'
import { Mock } from 'vitest'

import type { Props } from './Attachments'
import type { FileUpload } from './utils'

import { Attachments } from './Attachments'
import { MAX_UPLOAD_ATTEMPTS } from './Attachments'
import { ExistingFileType } from './page'
import { startUpload } from './utils'
import { textAreaComponent } from 'apps/melding-form/src/mocks/data'
import { ENDPOINTS } from 'apps/melding-form/src/mocks/endpoints'
import { server } from 'apps/melding-form/src/mocks/node'

const defaultProps: Props = {
  files: [],
  formData: [{ ...textAreaComponent, description: 'Test description' }],
  meldingId: 1,
  token: 'mock-token',
}

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...(typeof actual === 'object' ? actual : {}),
    useActionState: vi.fn().mockReturnValue([{}, vi.fn()]),
  }
})

window.crypto.randomUUID = vi.fn(() => 'test-id') as unknown as typeof window.crypto.randomUUID

global.URL.createObjectURL = vi.fn()
global.URL.revokeObjectURL = vi.fn()

vi.mock('@amsterdam/design-system-react/dist/common/useIsAfterBreakpoint', () => ({
  default: vi.fn(),
}))

vi.mock('./utils', () => ({
  startUpload: vi.fn(),
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
    const noJSAlertHeading = screen.getByRole('heading', { name: 'no-js-alert-title' })

    expect(backLink).toBeInTheDocument()
    expect(header).toBeInTheDocument()
    expect(heading).toBeInTheDocument()
    expect(description).toBeInTheDocument()
    expect(fileUpload).toBeInTheDocument()
    expect(noJSAlertHeading).toBeInTheDocument()
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

  it('shows initial uploads when provided', () => {
    const mockFileName = 'IMG_SERVER_TEST.jpg'
    const initialUploads: ExistingFileType[] = [
      {
        blob: { size: 4326, type: 'image/webp' } as Blob,
        fileName: mockFileName,
        serverId: 1,
      },
    ]

    render(<Attachments {...defaultProps} files={initialUploads} />)

    const fileName = screen.getAllByText(mockFileName)[0]

    expect(fileName).toBeInTheDocument()
  })

  it('shows initial uploads without image if download is not yet ready', () => {
    const mockFileName = 'IMG_SERVER_TEST.jpg'
    const initialUploads: ExistingFileType[] = [
      {
        blob: undefined,
        fileName: mockFileName,
        serverId: 1,
      },
    ]

    const { container } = render(<Attachments {...defaultProps} files={initialUploads} />)

    const fileName = screen.getAllByText(mockFileName)[0]
    const loadingIndicator = container.querySelector('[class*="_loading"]')

    expect(fileName).toBeInTheDocument()
    expect(loadingIndicator).toBeInTheDocument()
  })

  it('renders an Invalid Form Alert when an upload has an error', async () => {
    const user = userEvent.setup()

    ;(startUpload as Mock).mockImplementationOnce((_xhr, fileUpload, setFileUploads) => {
      setFileUploads((prev: FileUpload[]) =>
        prev.map((upload) =>
          upload.id === fileUpload.id ? { ...upload, errorMessage: 'Upload failed', status: 'error' } : upload,
        ),
      )
    })

    render(<Attachments {...defaultProps} />)

    const fileInput = screen.getByLabelText('File input')

    await user.upload(fileInput, [mockFile])

    const link = screen.getByRole('link', { name: 'Upload failed' })

    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '#file-upload.id-prefix-1')
  })

  it('renders an empty error message when an upload has an error without a message', async () => {
    const user = userEvent.setup()

    ;(startUpload as Mock).mockImplementationOnce((_xhr, fileUpload, setFileUploads) => {
      setFileUploads((prev: FileUpload[]) =>
        prev.map((upload) => (upload.id === fileUpload.id ? { ...upload, status: 'error' } : upload)),
      )
    })

    render(<Attachments {...defaultProps} />)

    const fileInput = screen.getByLabelText('File input')

    await user.upload(fileInput, [mockFile])

    const link = screen.getByRole('link', { name: '' })

    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '#file-upload.id-prefix-1')
  })

  it('renders an empty aria-live region when no file is deleted', () => {
    render(<Attachments {...defaultProps} />)

    const liveRegion = document.querySelector('[aria-live="polite"]')

    expect(liveRegion).toBeInTheDocument()
    expect(liveRegion).toBeEmptyDOMElement()
  })

  it('renders an aria-live region with a notification when a file is deleted', async () => {
    const user = userEvent.setup()

    const xhrMock: Partial<XMLHttpRequest> = { readyState: XMLHttpRequest.DONE }

    ;(startUpload as Mock).mockImplementationOnce((_xhr, fileUpload, setFileUploads) => {
      setFileUploads((prev: FileUpload[]) =>
        prev.map((upload) =>
          upload.id === fileUpload.id
            ? { ...upload, progress: 100, serverId: 123, status: 'success', xhr: xhrMock as XMLHttpRequest }
            : upload,
        ),
      )
    })

    render(<Attachments {...defaultProps} />)

    const fileInput = screen.getByLabelText('File input')

    await user.upload(fileInput, [mockFile])

    const deleteButton = screen.getByRole('button', { name: `file-upload.action-button-delete ${mockFile.name}` })

    await user.click(deleteButton)

    const liveRegion = screen.getByText('delete-notification')

    expect(liveRegion).toBeInTheDocument()
  })

  it('deletes a succesfully uploaded file with the delete button', async () => {
    const user = userEvent.setup()

    const xhrMock: Partial<XMLHttpRequest> = { readyState: XMLHttpRequest.DONE }

    ;(startUpload as Mock).mockImplementationOnce((_xhr, fileUpload, setFileUploads) => {
      setFileUploads((prev: FileUpload[]) =>
        prev.map((upload) =>
          upload.id === fileUpload.id
            ? { ...upload, progress: 100, serverId: 123, status: 'success', xhr: xhrMock as XMLHttpRequest }
            : upload,
        ),
      )
    })

    render(<Attachments {...defaultProps} />)

    const fileInput = screen.getByLabelText('File input')

    await user.upload(fileInput, [mockFile])

    const fileName1 = screen.getAllByText(mockFile.name)[0]

    expect(fileName1).toBeInTheDocument()

    const deleteButton = screen.getByRole('button', { name: `file-upload.action-button-delete ${mockFile.name}` })

    await user.click(deleteButton)

    const file1SecondRender = screen.queryByText(mockFile.name)

    expect(file1SecondRender).not.toBeInTheDocument()
  })

  it('deletes a prefilled attachment succesfully', async () => {
    const user = userEvent.setup()

    const mockFileName = 'IMG_SERVER_TEST.jpg'
    const initialUploads: ExistingFileType[] = [
      {
        blob: { size: 4326, type: 'image/webp' } as Blob,
        fileName: mockFileName,
        serverId: 1,
      },
    ]

    render(<Attachments {...defaultProps} files={initialUploads} />)

    const deleteButton = screen.getByRole('button', { name: `file-upload.action-button-delete ${mockFileName}` })

    await user.click(deleteButton)

    const file1SecondRender = screen.queryByText(mockFileName)

    expect(file1SecondRender).not.toBeInTheDocument()
  })

  it('cancels an in-progress upload and removes it from the file list with the cancel button', async () => {
    const user = userEvent.setup()

    const abortMock = vi.fn()

    const xhrMock: Partial<XMLHttpRequest> = { abort: abortMock, readyState: XMLHttpRequest.OPENED }

    ;(startUpload as Mock).mockImplementationOnce((_xhr, fileUpload, setFileUploads) => {
      setFileUploads((prev: FileUpload[]) =>
        prev.map((upload) =>
          upload.id === fileUpload.id
            ? { ...upload, progress: 20, serverId: 123, status: 'loading', xhr: xhrMock as XMLHttpRequest }
            : upload,
        ),
      )
    })

    render(<Attachments {...defaultProps} />)

    const fileInput = screen.getByLabelText('File input')

    await user.upload(fileInput, [mockFile])

    const deleteButton = screen.getByRole('button', { name: `file-upload.action-button-cancel ${mockFile.name}` })

    await user.click(deleteButton)

    const fileName = screen.queryByText(mockFile.name)

    expect(fileName).not.toBeInTheDocument()
    expect(abortMock).toHaveBeenCalled()
  })

  it('removes a failed upload from the file list with the delete button', async () => {
    const user = userEvent.setup()

    const xhrMock: Partial<XMLHttpRequest> = { readyState: XMLHttpRequest.DONE }

    ;(startUpload as Mock).mockImplementationOnce((_xhr, fileUpload, setFileUploads) => {
      setFileUploads((prev: FileUpload[]) =>
        prev.map((upload) =>
          upload.id === fileUpload.id
            ? { ...upload, progress: 0, serverId: undefined, status: 'error', xhr: xhrMock as XMLHttpRequest }
            : upload,
        ),
      )
    })

    render(<Attachments {...defaultProps} />)

    const fileInput = screen.getByLabelText('File input')

    await user.upload(fileInput, [mockFile])

    const deleteButton = screen.getByRole('button', { name: `file-upload.action-button-delete ${mockFile.name}` })

    await user.click(deleteButton)

    const fileName = screen.queryByText(mockFile.name)

    expect(fileName).not.toBeInTheDocument()
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

    ;(startUpload as Mock).mockImplementationOnce((_xhr, fileUpload, setFileUploads) => {
      setFileUploads((prev: FileUpload[]) =>
        prev.map((upload) =>
          upload.id === fileUpload.id
            ? { ...upload, progress: 100, serverId: 123, status: 'success', xhr: xhrMock as XMLHttpRequest }
            : upload,
        ),
      )
    })

    render(<Attachments {...defaultProps} />)

    const fileInput = screen.getByLabelText('File input')

    await user.upload(fileInput, [mockFile])

    const deleteButton = screen.getByRole('button', { name: `file-upload.action-button-delete ${mockFile.name}` })

    await user.click(deleteButton)

    const fileName = screen.getAllByText(mockFile.name)[0]
    const errorMessage = screen.getByText('An unknown error occurred')

    expect(fileName).toBeInTheDocument()
    expect(errorMessage).toBeInTheDocument()
  })

  it('throws an error when attempting to upload too many files', async () => {
    const user = userEvent.setup()

    render(<Attachments {...defaultProps} />)

    const fileInput = screen.getByLabelText('File input')

    const file = new File(['dummy content'], 'example.png', { type: 'image/png' })
    const file2 = new File(['dummy content two'], 'example2.png', { type: 'image/png' })
    const file3 = new File(['dummy content three'], 'example3.png', { type: 'image/png' })
    const file4 = new File(['dummy content four'], 'example4.png', { type: 'image/png' })

    await user.upload(fileInput, [file, file2, file3, file4])

    const errorMessageHeading = screen.getByText('errors.too-many-files.heading')
    const errorMessageDescription = screen.getByText('errors.too-many-files.description')

    expect(errorMessageHeading).toBeInTheDocument()
    expect(errorMessageDescription).toBeInTheDocument()
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

  it('marks a file as duplicate when the same file is uploaded twice and renders an error message', async () => {
    const user = userEvent.setup()

    render(<Attachments {...defaultProps} />)

    const fileInput = screen.getByLabelText('File input')

    const file = mockFile

    await user.upload(fileInput, [file])
    await user.upload(fileInput, [file])

    const errorMessage = screen.getAllByText('validation-errors.duplicate-upload')

    expect(errorMessage[0]).toBeInTheDocument()
  })

  it('shows an error when trying to upload too many files ', async () => {
    const user = userEvent.setup()

    render(<Attachments {...defaultProps} />)

    const fileInput = screen.getByLabelText('File input')

    await user.upload(
      fileInput,
      Array.from({ length: MAX_UPLOAD_ATTEMPTS + 1 }, () => mockFile),
    )

    const errorMessageHeading = screen.getByText('errors.too-many-attempts.heading')
    const errorMessageDescription = screen.getByText('errors.too-many-attempts.description')

    expect(errorMessageHeading).toBeInTheDocument()
    expect(errorMessageDescription).toBeInTheDocument()
  })

  it('shows an error when continuing while an upload is in progress', async () => {
    const user = userEvent.setup()

    const xhrMock: Partial<XMLHttpRequest> = { readyState: XMLHttpRequest.LOADING }

    ;(startUpload as Mock).mockImplementationOnce((_xhr, fileUpload, setFileUploads) => {
      setFileUploads((prev: FileUpload[]) =>
        prev.map((upload) =>
          upload.id === fileUpload.id
            ? { ...upload, progress: 20, serverId: 123, status: 'uploading', xhr: xhrMock as XMLHttpRequest }
            : upload,
        ),
      )
    })

    render(<Attachments {...defaultProps} />)

    const fileInput = screen.getByLabelText('File input')

    await user.upload(fileInput, [mockFile])

    const submitButton = screen.getByRole('button', { name: 'submit-button' })

    await user.click(submitButton)

    const errorMessageHeading = screen.getByText('errors.upload-in-progress.heading')
    const errorMessageDescription = screen.getByText('errors.upload-in-progress.description')

    expect(errorMessageHeading).toBeInTheDocument()
    expect(errorMessageDescription).toBeInTheDocument()
  })
})
