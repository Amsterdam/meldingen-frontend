import type { ComponentProps } from 'react'

import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'

import { AddAttachment, MAX_ATTACHMENT_SIZE_BYTES } from './AddAttachment'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'

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
    render(<AddAttachment attachments={[createAttachment({ id: 7 })]} meldingId={123} />)

    const fileName = screen.getAllByText('existing.png')[0]
    const links = screen.getAllByRole('link', { name: 'back-link' })

    expect(fileName).toBeInTheDocument()
    expect(links).toHaveLength(2)
  })

  it('shows an empty aria-live region when no file has been deleted', () => {
    render(<AddAttachment attachments={[createAttachment({ originalFilename: 'first.png' })]} meldingId={123} />)

    const liveRegion = document.querySelector('.ams-visually-hidden[aria-live="polite"]')

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
        attachments={[
          createAttachment({
            blob: new Blob(['sample content']),
            originalFilename: 'first.png',
          }),
        ]}
        meldingId={123}
      />,
    )

    const deleteButton = screen.getByRole('button', { name: 'file-upload.action-button-delete first.png' })

    deleteButton.focus()
    await user.keyboard('{Enter}')

    expect(confirmSpy).toHaveBeenCalledWith('confirmation-prompt')
    expect(confirmSpy).toHaveReturnedWith(true)

    await waitFor(() => expect(deleteButton).not.toBeInTheDocument())
    expect(screen.getByRole('button', { name: /file-upload.select-file-button/ })).toHaveFocus()
    expect(screen.getByRole('link', { name: 'cancel-link' })).toBeInTheDocument()
  })

  it('keeps focus on the delete button and does not delete when confirmation is cancelled', async () => {
    const user = userEvent.setup()
    const deleteHandler = vi.fn(() => new HttpResponse(null, { status: 204 }))

    server.use(http.delete(ENDPOINTS.DELETE_ATTACHMENT_BY_ID, deleteHandler))
    vi.spyOn(window, 'confirm').mockReturnValueOnce(false)

    render(<AddAttachment attachments={[createAttachment()]} meldingId={123} />)

    const deleteButton = screen.getByRole('button', { name: 'file-upload.action-button-delete existing.png' })

    deleteButton.focus()
    await user.keyboard('{Enter}')

    expect(deleteButton).toHaveFocus()
    expect(deleteButton).toBeInTheDocument()
    expect(deleteHandler).not.toHaveBeenCalled()
    expect(screen.queryByText('delete-notification')).not.toBeInTheDocument()
  })

  it.each([
    ['keeps focus on the upload button', false],
    ['respects navigation to another control', true],
  ])('%s when a pending deletion succeeds', async (_, moveFocus) => {
    const user = userEvent.setup()
    let resolveDeletion = () => {}
    const deletionResponse = new Promise<void>((resolve) => {
      resolveDeletion = resolve
    })
    const deleteHandler = vi.fn(async () => {
      await deletionResponse

      return new HttpResponse(null, { status: 204 })
    })

    server.use(http.delete(ENDPOINTS.DELETE_ATTACHMENT_BY_ID, deleteHandler))

    render(
      <AddAttachment
        attachments={[createAttachment(), createAttachment({ id: 2, originalFilename: 'second.png' })]}
        meldingId={123}
      />,
    )

    const deleteButton = screen.getByRole('button', { name: 'file-upload.action-button-delete existing.png' })
    const uploadButton = screen.getByRole('button', { name: /file-upload.select-file-button/ })
    const backLink = screen.getAllByRole('link', { name: 'back-link' })[0]

    try {
      deleteButton.focus()
      await user.keyboard('{Enter}')

      await waitFor(() => expect(deleteHandler).toHaveBeenCalledOnce())
      expect(deleteButton).toBeInTheDocument()
      expect(uploadButton).toHaveFocus()
      expect(screen.queryByText('delete-notification')).not.toBeInTheDocument()

      if (moveFocus) {
        await user.tab({ shift: true })
        expect(backLink).toHaveFocus()
      }
    } finally {
      resolveDeletion()
    }

    await waitFor(() => expect(deleteButton).not.toBeInTheDocument())

    expect(moveFocus ? backLink : uploadButton).toHaveFocus()
    expect(screen.getByRole('button', { name: 'file-upload.action-button-delete second.png' })).toBeInTheDocument()
    expect(screen.getByText('delete-notification')).toBeInTheDocument()
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

  it('focuses the upload button rather than the Invalid Form Alert when a failed upload is deleted', async () => {
    const user = userEvent.setup()
    const { container } = render(<AddAttachment {...defaultProps} attachments={[createAttachment()]} />)

    const fileInput = screen.getByLabelText('File input')
    const duplicateFile = new File(['dummy content'], 'existing.png', { type: 'image/png' })

    fireEvent.change(fileInput, { target: { files: [duplicateFile] } })
    fireEvent.change(fileInput, { target: { files: [duplicateFile] } })

    // The first button belongs to the existing file, the other two to the failed uploads
    const deleteButtons = screen.getAllByRole('button', { name: 'file-upload.action-button-delete existing.png' })

    deleteButtons[2].focus()
    await user.keyboard('{Enter}')

    const alert = container.querySelector('.ams-alert')

    expect(screen.getAllByRole('button', { name: 'file-upload.action-button-delete existing.png' })).toHaveLength(2)
    expect(alert).toBeInTheDocument()
    expect(alert).not.toHaveFocus()
    expect(screen.getByRole('button', { name: /file-upload.select-file-button/ })).toHaveFocus()
  })

  it('shows a delete notification and removes only the deleted file when deletion succeeds', async () => {
    const user = userEvent.setup()

    render(
      <AddAttachment
        attachments={[
          createAttachment({ originalFilename: 'first.png' }),
          createAttachment({ blob: new Blob(['b']), id: 2, originalFilename: 'second.png' }),
        ]}
        meldingId={123}
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
      <AddAttachment attachments={[createAttachment({ originalFilename: 'first.png' })]} meldingId={123} />,
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
