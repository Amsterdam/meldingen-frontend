import type { ComponentProps } from 'react'

import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'

import { AddAttachment, MAX_ATTACHMENT_SIZE_BYTES } from './AddAttachment'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'

vi.mock('./AttachmentsList', () => ({
  AttachmentsList: ({
    files,
    handleDelete,
  }: {
    files: Array<{ file: File; id: string; serverId?: number; xhr?: XMLHttpRequest }>
    handleDelete: (id: string, fileName: string, xhr?: XMLHttpRequest, serverId?: number) => void
  }) => (
    <ul>
      {files.map(({ file, id, serverId, xhr }) => (
        <li key={id}>
          <span>{file.name}</span>
          <button onClick={() => handleDelete(id, file.name, xhr, serverId)}>
            {`file-upload.action-button-delete ${file.name}`}
          </button>
        </li>
      ))}
    </ul>
  ),
}))

global.URL.createObjectURL = vi.fn()
global.URL.revokeObjectURL = vi.fn()
window.confirm = vi.fn(() => true)

const mockFile = new File(['dummy content'], 'example.png', { type: 'image/png' })

type AddAttachmentProps = ComponentProps<typeof AddAttachment>

const createAttachment = (
  overrides: Partial<AddAttachmentProps['attachments'][number]> = {},
): AddAttachmentProps['attachments'][number] => ({
  blob: new Blob(['dummy content'], { type: 'image/png' }),
  createdAt: '2025-01-01T00:00:00Z',
  id: 1,
  originalFilename: 'existing.png',
  updatedAt: '2025-01-01T00:00:00Z',
  ...overrides,
})

const defaultProps = {
  attachments: [],
  meldingId: 123,
  publicId: 'ABC',
} satisfies AddAttachmentProps

describe('AddAttachment', () => {
  it('renders correctly', () => {
    render(<AddAttachment {...defaultProps} />)

    const backLink = screen.getByRole('link', { name: 'back-link' })
    const heading = screen.getByRole('heading', { level: 1, name: 'title' })
    const uploadButton = screen.getByRole('button')
    const bottomLink = screen.getByRole('link', { name: 'cancel-link' })

    expect(backLink).toBeInTheDocument()
    expect(heading).toBeInTheDocument()
    expect(uploadButton).toBeInTheDocument()
    expect(bottomLink).toBeInTheDocument()

    expect(uploadButton).toHaveTextContent('file-upload.drop-area')
    expect(uploadButton).toHaveTextContent('file-upload.select-file-button')
  })

  it('renders existing attachments and shows the back-link instead of the cancel-link', () => {
    render(<AddAttachment {...defaultProps} attachments={[createAttachment({ id: 7 })]} />)

    const fileName = screen.getAllByText('existing.png')[0]
    const links = screen.getAllByRole('link', { name: 'back-link' })

    expect(fileName).toBeInTheDocument()
    expect(links).toHaveLength(2)
  })

  it('shows an empty aria-live region when no file has been deleted', () => {
    render(<AddAttachment {...defaultProps} attachments={[createAttachment({ originalFilename: 'first.png' })]} />)

    const liveRegion = document.querySelector('[aria-live="polite"]')

    expect(liveRegion).toBeInTheDocument()
    expect(liveRegion).toBeEmptyDOMElement()
  })

  it('uploads a file and shows it in the list once the upload succeeds', async () => {
    const user = userEvent.setup()

    render(<AddAttachment {...defaultProps} />)

    const fileInput = screen.getByLabelText('File input')

    await user.upload(fileInput, [mockFile])

    const deleteButton = await screen.findByRole('button', {
      name: `file-upload.action-button-delete ${mockFile.name}`,
    })

    expect(deleteButton).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: 'back-link' })).toHaveLength(2)
  })

  it('confirms deletion with the file name before deleting', async () => {
    const user = userEvent.setup()
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

    render(
      <AddAttachment
        {...defaultProps}
        attachments={[
          createAttachment({
            blob: new Blob(['sample content']),
            originalFilename: 'first.png',
          }),
        ]}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'file-upload.action-button-delete first.png' }))

    expect(confirmSpy).toHaveBeenCalledWith('confirmation-prompt')
    expect(confirmSpy).toHaveReturnedWith(true)

    expect(screen.queryByText('first.png')).not.toBeInTheDocument()
  })

  it('shows a validation error when the upload fails', async () => {
    server.use(
      http.post(ENDPOINTS.POST_API_MELDING_BY_MELDING_ID_ATTACHMENT, () =>
        HttpResponse.json({ detail: 'Allowed content size exceeded' }, { status: 422 }),
      ),
    )

    const user = userEvent.setup()
    const { container } = render(<AddAttachment {...defaultProps} />)

    const fileInput = screen.getByLabelText('File input')

    await user.upload(fileInput, [mockFile])

    const validationLink = await screen.findByRole('link', { name: 'validation-errors.file-too-large' })

    expect(validationLink).toHaveAttribute('href', '#file-upload.id-prefix-1')

    const validationAlert = container.querySelector('.ams-alert')

    expect(validationAlert).toHaveTextContent('validation-errors.alert-titlevalidation-errors.file-too-large')

    await waitFor(() => expect(validationAlert).toHaveFocus())
  })

  it('shows a validation error without uploading when the file is too large', async () => {
    const uploadHandler = vi.fn(() => HttpResponse.json({ id: 42 }))

    server.use(http.post(ENDPOINTS.POST_API_MELDING_BY_MELDING_ID_ATTACHMENT, uploadHandler))

    const user = userEvent.setup()

    render(<AddAttachment {...defaultProps} />)

    // Overriding size instead of creating a real file of over 20 MB, to keep the test fast
    const largeFile = new File(['x'], 'large.png', { type: 'image/png' })

    Object.defineProperty(largeFile, 'size', { value: MAX_ATTACHMENT_SIZE_BYTES + 1 })

    await user.upload(screen.getByLabelText('File input'), [largeFile])

    expect(await screen.findByRole('link', { name: 'validation-errors.file-too-large' })).toBeInTheDocument()
    expect(uploadHandler).not.toHaveBeenCalled()
  })

  it('shows a generic error alert and focuses it when too many files are selected', () => {
    const { container } = render(<AddAttachment {...defaultProps} />)

    const fileInput = screen.getByLabelText('File input')

    const files = Array.from({ length: 6 }, (_, index) => new File(['x'], `file-${index}.png`, { type: 'image/png' }))

    // Using fireEvent instead of userEvent.upload here, because userEvent simulates the browser
    // restoring focus to the file input once the (simulated) file picker closes, which would
    // overwrite the focus we're asserting on the alert.
    fireEvent.change(fileInput, { target: { files } })

    const alert = container.querySelector('.ams-alert')

    expect(alert).toHaveTextContent('errors.too-many-files.title')
    expect(alert).toHaveFocus()
  })

  it('refocuses the generic error alert when too many files are selected again', () => {
    const { container } = render(<AddAttachment {...defaultProps} />)

    const fileInput = screen.getByLabelText('File input')
    const files = Array.from({ length: 6 }, (_, index) => new File(['x'], `file-${index}.png`, { type: 'image/png' }))

    fireEvent.change(fileInput, { target: { files } })

    const alert = container.querySelector('.ams-alert')

    expect(alert).toHaveFocus()

    fileInput.focus()
    fireEvent.change(fileInput, { target: { files } })

    expect(alert).toHaveFocus()
  })

  it('refocuses the Invalid Form Alert when another upload fails with the same error', () => {
    const { container } = render(<AddAttachment {...defaultProps} attachments={[createAttachment()]} />)

    const fileInput = screen.getByLabelText('File input')
    const duplicateFile = new File(['dummy content'], 'existing.png', { type: 'image/png' })

    // Using fireEvent instead of userEvent.upload here, because userEvent restores focus to the file input
    fireEvent.change(fileInput, { target: { files: [duplicateFile] } })

    expect(container.querySelector('.ams-alert')).toHaveFocus()

    fileInput.focus()

    expect(fileInput).toHaveFocus()

    fireEvent.change(fileInput, { target: { files: [duplicateFile] } })

    expect(container.querySelector('.ams-alert')).toHaveFocus()
  })

  it('does not move focus to the Invalid Form Alert when a failed upload is deleted', () => {
    const { container } = render(<AddAttachment {...defaultProps} attachments={[createAttachment()]} />)

    const fileInput = screen.getByLabelText('File input')
    const duplicateFile = new File(['dummy content'], 'existing.png', { type: 'image/png' })

    fireEvent.change(fileInput, { target: { files: [duplicateFile] } })
    fireEvent.change(fileInput, { target: { files: [duplicateFile] } })

    fileInput.focus()

    // The first button belongs to the existing file, the other two to the failed uploads
    const deleteButtons = screen.getAllByRole('button', { name: 'file-upload.action-button-delete existing.png' })

    fireEvent.click(deleteButtons[2])

    const alert = container.querySelector('.ams-alert')

    expect(screen.getAllByRole('button', { name: 'file-upload.action-button-delete existing.png' })).toHaveLength(2)
    expect(alert).toBeInTheDocument()
    expect(alert).not.toHaveFocus()
    expect(fileInput).toHaveFocus()
  })

  it('shows a delete notification and removes only the deleted file when deletion succeeds', async () => {
    const user = userEvent.setup()

    render(
      <AddAttachment
        {...defaultProps}
        attachments={[
          createAttachment({ originalFilename: 'first.png' }),
          createAttachment({ blob: new Blob(['b']), id: 2, originalFilename: 'second.png' }),
        ]}
      />,
    )

    const deleteButton = screen.getByRole('button', { name: 'file-upload.action-button-delete first.png' })

    await user.click(deleteButton)

    const notification = await screen.findByText('delete-notification')

    expect(notification).toBeInTheDocument()
    expect(screen.queryByText('first.png')).not.toBeInTheDocument()
    expect(screen.getAllByText('second.png')[0]).toBeInTheDocument()
  })

  it('shows a generic error alert and logs the error when deletion fails', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    server.use(
      http.delete(ENDPOINTS.DELETE_ATTACHMENT_BY_ID, () => HttpResponse.json({ detail: 'API error' }, { status: 404 })),
    )

    const user = userEvent.setup()

    const { container } = render(
      <AddAttachment {...defaultProps} attachments={[createAttachment({ originalFilename: 'first.png' })]} />,
    )

    const deleteButton = screen.getByRole('button', { name: 'file-upload.action-button-delete first.png' })

    await user.click(deleteButton)

    const alert = await screen.findByText('errors.delete-failed.title')

    expect(alert).toBeInTheDocument()
    expect(screen.getAllByText('first.png')[0]).toBeInTheDocument()

    expect(consoleErrorSpy).toHaveBeenCalledWith('API error')
    expect(container.querySelector('.ams-alert')).toHaveFocus()

    consoleErrorSpy.mockRestore()
  })

  it('only shows a generic error as long as no validation errors are present', async () => {
    const user = userEvent.setup()

    render(<AddAttachment {...defaultProps} attachments={[createAttachment()]} />)

    const fileInput = screen.getByLabelText('File input')
    const files = Array.from({ length: 6 }, (_, index) => new File(['x'], `file-${index}.png`, { type: 'image/png' }))

    await user.upload(fileInput, files)

    expect(screen.getByText('errors.too-many-files.title')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'validation-errors.duplicate-upload' })).not.toBeInTheDocument()

    const duplicateFile = new File(['dummy content'], 'existing.png', { type: 'image/png' })

    await user.upload(fileInput, [duplicateFile])

    expect(screen.getByRole('link', { name: 'validation-errors.duplicate-upload' })).toBeInTheDocument()
    expect(screen.queryByText('errors.too-many-files.title')).not.toBeInTheDocument()

    await user.upload(fileInput, files)

    expect(screen.getByRole('link', { name: 'validation-errors.duplicate-upload' })).toBeInTheDocument()
    expect(screen.queryByText('errors.too-many-files.title')).not.toBeInTheDocument()
  })
})

describe('document title', () => {
  const tooManyFiles = Array.from(
    { length: 6 },
    (_, index) => new File(['x'], `file-${index}.png`, { type: 'image/png' }),
  )

  it('sets the base document title when there are no errors', () => {
    render(<AddAttachment {...defaultProps} />)

    expect(document.title).toBe('metadata.title')
  })

  it('prefixes the error count on a failed upload and restores the base title once it is deleted', () => {
    render(<AddAttachment {...defaultProps} attachments={[createAttachment()]} />)

    const duplicateFile = new File(['dummy content'], 'existing.png', { type: 'image/png' })

    fireEvent.change(screen.getByLabelText('File input'), { target: { files: [duplicateFile] } })

    expect(document.title).toBe('document-title-error-count-prefix metadata.title')

    // The first button belongs to the existing file, the second to the failed upload
    fireEvent.click(screen.getAllByRole('button', { name: 'file-upload.action-button-delete existing.png' })[1])

    expect(document.title).toBe('metadata.title')
  })

  it('uses the generic error heading instead of the API error heading and restores the base title once it is resolved', async () => {
    const user = userEvent.setup()

    render(<AddAttachment {...defaultProps} />)

    const fileInput = screen.getByLabelText('File input')

    fireEvent.change(fileInput, { target: { files: tooManyFiles } })

    expect(document.title).toBe('errors.too-many-files.title - metadata.title')

    await user.upload(fileInput, [mockFile])

    expect(document.title).toBe('metadata.title')
  })

  it('uses the delete failed heading when deleting an attachment fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})

    server.use(
      http.delete(ENDPOINTS.DELETE_ATTACHMENT_BY_ID, () => HttpResponse.json({ detail: 'API error' }, { status: 404 })),
    )

    const user = userEvent.setup()

    render(<AddAttachment {...defaultProps} attachments={[createAttachment({ originalFilename: 'first.png' })]} />)

    await user.click(screen.getByRole('button', { name: 'file-upload.action-button-delete first.png' }))

    await waitFor(() => expect(document.title).toBe('errors.delete-failed.title - metadata.title'))
  })

  it('keeps validation errors in the document title when upload attempts are exceeded', () => {
    render(<AddAttachment {...defaultProps} attachments={[createAttachment()]} />)

    const fileInput = screen.getByLabelText('File input')
    const duplicateFile = new File(['dummy content'], 'existing.png', { type: 'image/png' })

    fireEvent.change(fileInput, { target: { files: [duplicateFile] } })
    // 1 existing + 1 failed + 9 new files exceeds the maximum number of upload attempts
    fireEvent.change(fileInput, { target: { files: [...tooManyFiles, ...tooManyFiles.slice(0, 3)] } })

    expect(screen.getByRole('link', { name: 'validation-errors.duplicate-upload' })).toBeInTheDocument()
    expect(screen.queryByText('errors.too-many-attempts.title')).not.toBeInTheDocument()
    expect(document.title).toBe('document-title-error-count-prefix metadata.title')
  })
})
