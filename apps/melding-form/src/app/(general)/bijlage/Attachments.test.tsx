import type { Mock } from 'vitest'

import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { delay, http, HttpResponse } from 'msw'
import { useActionState } from 'react'

import type { Props } from './Attachments'

import { Attachments, MAX_ATTACHMENT_SIZE_BYTES } from './Attachments'
import { textAreaComponent } from '~/mocks/data'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'

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
    useActionState: vi.fn().mockReturnValue([{}, vi.fn(), false]),
  }
})

window.crypto.randomUUID = vi.fn(() => 'test-id') as unknown as typeof window.crypto.randomUUID

global.URL.createObjectURL = vi.fn()
global.URL.revokeObjectURL = vi.fn()

const mockFile = new File(['dummy content'], 'example.png', { type: 'image/png' })
const existingFile = {
  blob: new Blob(['dummy content'], { type: 'image/png' }),
  fileName: 'existing.png',
  serverId: 1,
}
const duplicateFile = new File(['dummy content'], 'existing.png', { type: 'image/png' })

// The translation mock returns keys, so a message reads as '<announcement key> <file count key>'
const deletedMessage = 'announcements.deleted status'

const changeFileInputWithoutRestoringFocus = (fileInput: HTMLElement, files: File[]) => {
  // userEvent.upload restores focus to the file input after the change handler, masking alert focus.
  fireEvent.change(fileInput, { target: { files } })
}

describe('Attachments', () => {
  it('renders the component with the correct document title', () => {
    render(<Attachments {...defaultProps} />)

    expect(document.title).toBe('First question - organisation-name')
  })

  it('renders correctly', () => {
    render(<Attachments {...defaultProps} />)

    const backLink = screen.getByRole('link', { name: 'back-link' })
    const heading = screen.getByRole('heading', { name: 'First question hint-text' })
    const description = screen.getByText('Test description')
    const fileUpload = screen.getByRole('button', {
      name: 'First question hint-text file-upload.button',
    })
    const noJSAlertHeading = screen.getByRole('heading', { name: 'no-js-alert-title' })

    expect(backLink).toBeInTheDocument()
    expect(heading).toBeInTheDocument()
    expect(description).toBeInTheDocument()
    expect(fileUpload).toBeInTheDocument()
    expect(noJSAlertHeading).toBeInTheDocument()
  })

  it('shows file names when a file is uploaded', async () => {
    // This is more or less an integration test, to make sure the useFileUploads hook is wired up correctly.
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

  it('renders an API error Alert, focuses it and updates the document title when there is an API error', () => {
    ;(useActionState as Mock).mockReturnValueOnce([{ apiError: 'Test error message' }, vi.fn(), false])

    const { container } = render(<Attachments {...defaultProps} />)

    const alert = container.querySelector('.ams-alert')

    expect(alert).toHaveTextContent('heading')
    expect(alert).toHaveFocus()

    expect(document.title).toBe(`api-error-alert.heading - ${textAreaComponent.label} - organisation-name`)
  })

  // A server error arrives later, when the user may be doing something else, so focus must stay where it is
  it('renders an Invalid Form Alert and announces the failure, but keeps focus, when the server rejects an upload', async () => {
    server.use(
      http.post(ENDPOINTS.POST_MELDING_BY_MELDING_ID_ATTACHMENT_MELDER, () =>
        HttpResponse.json({ detail: 'Allowed content size exceeded' }, { status: 422 }),
      ),
    )

    render(<Attachments {...defaultProps} />)

    const fileInput = screen.getByLabelText('File input')
    const submitButton = screen.getByRole('button', { name: 'submit-button' })

    changeFileInputWithoutRestoringFocus(fileInput, [mockFile])
    // The user moves on while the file is uploading
    submitButton.focus()

    const link = await screen.findByRole('link', { name: 'validation-errors.with-file-name' })

    // The link leads to the failed file, which shows the server's error
    expect(link).toHaveAttribute('href', '#file-upload.id-prefix-1')
    expect(screen.getByText('validation-errors.file-too-large')).toBeInTheDocument()
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('announcements.upload-failed status'))
    expect(submitButton).toHaveFocus()
    expect(document.title).toBe(`document-title-error-count-prefix ${textAreaComponent.label} - organisation-name`)
  })

  // Regression: the alert used to remount with the old focus trigger and take focus on a later server error
  it('keeps focus when the server rejects an upload after an earlier validation error was deleted', async () => {
    server.use(
      http.post(ENDPOINTS.POST_MELDING_BY_MELDING_ID_ATTACHMENT_MELDER, () =>
        HttpResponse.json({ detail: 'Attachment not allowed' }, { status: 422 }),
      ),
    )

    const user = userEvent.setup()

    const { container } = render(<Attachments {...defaultProps} />)

    const fileInput = screen.getByLabelText('File input')
    const largeFile = new File(['x'], 'large.png', { type: 'image/png' })

    Object.defineProperty(largeFile, 'size', { value: MAX_ATTACHMENT_SIZE_BYTES + 1 })

    changeFileInputWithoutRestoringFocus(fileInput, [largeFile])

    await waitFor(() => expect(container.querySelector('.ams-alert')).toHaveFocus())

    await user.click(screen.getByRole('button', { name: `file-upload.action-button-delete ${largeFile.name}` }))

    // With no errors left, the alert is removed, so the next error mounts it again
    await waitFor(() =>
      expect(screen.queryByRole('heading', { name: 'validation-errors.alert-title' })).not.toBeInTheDocument(),
    )

    const submitButton = screen.getByRole('button', { name: 'submit-button' })

    changeFileInputWithoutRestoringFocus(fileInput, [mockFile])
    // The user moves on while the file is uploading
    submitButton.focus()

    await screen.findByRole('link', { name: 'validation-errors.with-file-name' })

    expect(submitButton).toHaveFocus()
  })

  it('shows a validation error without uploading when the file is too large', async () => {
    const uploadHandler = vi.fn(() => HttpResponse.json({ id: 42 }))

    server.use(http.post(ENDPOINTS.POST_MELDING_BY_MELDING_ID_ATTACHMENT_MELDER, uploadHandler))

    const user = userEvent.setup()

    render(<Attachments {...defaultProps} />)

    const largeFile = new File(['x'], 'large.png', { type: 'image/png' })

    Object.defineProperty(largeFile, 'size', { value: MAX_ATTACHMENT_SIZE_BYTES + 1 })

    await user.upload(screen.getByLabelText('File input'), [largeFile])

    expect(await screen.findByRole('link', { name: 'validation-errors.with-file-name' })).toBeInTheDocument()
    // The error link leads to this button, so the error must be read there
    expect(
      screen.getByRole('button', { name: `file-upload.action-button-delete ${largeFile.name}` }),
    ).toHaveAccessibleDescription('file-upload.error-prefix: validation-errors.file-too-large')
    expect(uploadHandler).not.toHaveBeenCalled()
  })

  it('refocuses the Invalid Form Alert when another upload fails with the same error', () => {
    const { container } = render(<Attachments {...defaultProps} files={[existingFile]} />)

    const fileInput = screen.getByLabelText('File input')

    changeFileInputWithoutRestoringFocus(fileInput, [duplicateFile])

    expect(container.querySelector('.ams-alert')).toHaveFocus()

    fileInput.focus()

    expect(fileInput).toHaveFocus()

    changeFileInputWithoutRestoringFocus(fileInput, [duplicateFile])

    expect(container.querySelector('.ams-alert')).toHaveFocus()
  })

  it('does not move focus to the Invalid Form Alert when a failed upload is deleted', () => {
    const { container } = render(<Attachments {...defaultProps} files={[existingFile]} />)

    const fileInput = screen.getByLabelText('File input')
    const uploadButton = screen.getByRole('button', {
      name: 'First question hint-text file-upload.button',
    })

    changeFileInputWithoutRestoringFocus(fileInput, [duplicateFile])

    changeFileInputWithoutRestoringFocus(fileInput, [duplicateFile])

    fileInput.focus()

    // The first button belongs to the existing file, the other two to the failed uploads
    const deleteButtons = screen.getAllByRole('button', { name: 'file-upload.action-button-delete existing.png' })

    fireEvent.click(deleteButtons[2])

    const alert = container.querySelector('.ams-alert')

    expect(screen.getAllByRole('button', { name: 'file-upload.action-button-delete existing.png' })).toHaveLength(2)
    expect(alert).toBeInTheDocument()
    expect(alert).not.toHaveFocus()
    expect(uploadButton).toHaveFocus()
  })

  it('renders a generic error Alert, focuses it and updates the document title when there is a generic error', () => {
    const { container } = render(<Attachments {...defaultProps} />)

    const fileInput = screen.getByLabelText('File input')

    const file2 = new File(['dummy content two'], 'example2.png', { type: 'image/png' })
    const file3 = new File(['dummy content three'], 'example3.png', { type: 'image/png' })
    const file4 = new File(['dummy content four'], 'example4.png', { type: 'image/png' })

    changeFileInputWithoutRestoringFocus(fileInput, [mockFile, file2, file3, file4])

    const alert = container.querySelector('.ams-alert')

    expect(alert).toHaveTextContent('errors.too-many-files.title')
    expect(alert).toHaveFocus()

    expect(document.title).toBe(`errors.too-many-files.title - ${textAreaComponent.label} - organisation-name`)
  })

  it('announces a deleted file in a live region that is already present before the deletion', async () => {
    const user = userEvent.setup()

    const { container } = render(<Attachments {...defaultProps} />)

    // Screen readers only reliably announce changes to live regions that already exist in the DOM
    const liveRegionsBeforeDelete = Array.from(container.querySelectorAll('[aria-live]'))

    expect(screen.queryByText(deletedMessage)).not.toBeInTheDocument()

    const fileInput = screen.getByLabelText('File input')

    await user.upload(fileInput, [mockFile])

    const deleteButton = await screen.findByRole('button', {
      name: `file-upload.action-button-delete ${mockFile.name}`,
    })

    await user.click(deleteButton)

    const notification = await screen.findByText(deletedMessage)
    const liveRegion = notification.closest('[aria-live]')

    expect(liveRegion).toHaveAttribute('aria-live', 'polite')
    expect(liveRegionsBeforeDelete).toContain(liveRegion)
  })

  // Separate status regions that change at the same time interrupt each other in screen readers
  it('has a single status region for upload messages', () => {
    render(<Attachments {...defaultProps} />)

    expect(screen.getAllByRole('status')).toHaveLength(1)
  })

  it('announces when an upload starts and when it succeeds', async () => {
    const user = userEvent.setup()

    render(<Attachments {...defaultProps} />)

    await user.upload(screen.getByLabelText('File input'), [mockFile])

    const status = screen.getByRole('status')

    await waitFor(() => expect(status).toHaveTextContent('announcements.upload-started status'))
    await waitFor(() => expect(status).toHaveTextContent('announcements.upload-succeeded status'))
  })

  it('announces uploads that succeed and fail at about the same time in one message', async () => {
    let requestCount = 0

    // Uploads are sent in the order they were chosen, so the second request belongs to rejected.png
    server.use(
      http.post(ENDPOINTS.POST_MELDING_BY_MELDING_ID_ATTACHMENT_MELDER, () => {
        requestCount += 1

        return requestCount === 2
          ? HttpResponse.json({ detail: 'Attachment not allowed' }, { status: 422 })
          : HttpResponse.json({ id: 123 })
      }),
    )

    const user = userEvent.setup()

    render(<Attachments {...defaultProps} />)

    const rejectedFile = new File(['dummy content two'], 'rejected.png', { type: 'image/png' })

    await user.upload(screen.getByLabelText('File input'), [mockFile, rejectedFile])

    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent(
        'announcements.upload-succeeded announcements.upload-failed status',
      ),
    )
  })

  it('announces a deletion again when a file with the same name is deleted right after', async () => {
    const user = userEvent.setup()

    render(<Attachments {...defaultProps} files={[existingFile]} />)

    // The duplicate gets a validation error, so there is no other announcement between the two deletions
    await user.upload(screen.getByLabelText('File input'), [duplicateFile])

    const deleteButtonName = `file-upload.action-button-delete ${existingFile.fileName}`
    const [, duplicateDeleteButton] = await screen.findAllByRole('button', { name: deleteButtonName })

    await user.click(duplicateDeleteButton)

    const firstNotification = await screen.findByText(deletedMessage)

    await user.click(screen.getByRole('button', { name: deleteButtonName }))

    // The same text in a new element counts as a change for screen readers, so the deletion is announced again
    await waitFor(() => expect(screen.getByText(deletedMessage)).not.toBe(firstNotification))
  })

  it('moves focus to the upload button when an existing file is deleted', async () => {
    const user = userEvent.setup()

    render(<Attachments {...defaultProps} files={[existingFile]} />)

    const uploadButton = screen.getByRole('button', {
      name: 'First question hint-text file-upload.button',
    })
    const deleteButton = screen.getByRole('button', {
      name: `file-upload.action-button-delete ${existingFile.fileName}`,
    })

    await user.click(deleteButton)

    expect(uploadButton).toHaveFocus()
  })

  it('cancels an in-progress upload and removes it from the file list with the cancel button', async () => {
    // This is more or less an integration test, to make sure the XHR reference from fileUploads is passed back to handleDelete correctly
    server.use(
      http.post(ENDPOINTS.POST_MELDING_BY_MELDING_ID_ATTACHMENT_MELDER, async () => {
        await delay('infinite')

        return HttpResponse.json({ id: 123 })
      }),
    )

    const abortSpy = vi.spyOn(XMLHttpRequest.prototype, 'abort')
    const user = userEvent.setup()

    render(<Attachments {...defaultProps} />)

    const fileInput = screen.getByLabelText('File input')

    await user.upload(fileInput, [mockFile])

    const cancelButton = await screen.findByRole('button', {
      name: `file-upload.action-button-cancel ${mockFile.name}`,
    })

    await user.click(cancelButton)

    const fileName = screen.queryByText(mockFile.name)

    expect(fileName).not.toBeInTheDocument()
    expect(abortSpy).toHaveBeenCalled()

    abortSpy.mockRestore()
  })

  it('shows a generic error Alert and logs the error to the console when delete request fails', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    server.use(
      http.delete(
        ENDPOINTS.DELETE_MELDING_BY_MELDING_ID_ATTACHMENT_BY_ATTACHMENT_ID,
        () => new HttpResponse('API error', { status: 404 }),
      ),
    )

    const user = userEvent.setup()

    const { container } = render(<Attachments {...defaultProps} />)

    const fileInput = screen.getByLabelText('File input')

    await user.upload(fileInput, [mockFile])

    const deleteButton = await screen.findByRole('button', {
      name: `file-upload.action-button-delete ${mockFile.name}`,
    })

    await user.click(deleteButton)

    const alert = container.querySelector('.ams-alert')

    await waitFor(() => expect(alert).toHaveTextContent('errors.delete-failed.title'))

    expect(document.title).toBe(`errors.delete-failed.title - ${textAreaComponent.label} - organisation-name`)
    expect(consoleErrorSpy).toHaveBeenCalledWith('API error')

    consoleErrorSpy.mockRestore()
  })

  it('shows a generic error Alert when trying to navigate to the next page while an upload is in progress', async () => {
    server.use(
      http.post(ENDPOINTS.POST_MELDING_BY_MELDING_ID_ATTACHMENT_MELDER, async () => {
        await delay('infinite')

        return HttpResponse.json({ id: 123 })
      }),
    )

    const user = userEvent.setup()

    const { container } = render(<Attachments {...defaultProps} />)

    const fileInput = screen.getByLabelText('File input')

    await user.upload(fileInput, [mockFile])

    await screen.findByRole('button', { name: `file-upload.action-button-cancel ${mockFile.name}` })

    const submitButton = screen.getByRole('button', { name: 'submit-button' })

    await user.click(submitButton)

    const alert = container.querySelector('.ams-alert')

    expect(alert).toHaveTextContent('errors.upload-in-progress.title')
    expect(alert).toHaveTextContent('errors.upload-in-progress.description')
    expect(document.title).toBe(`errors.upload-in-progress.title - ${textAreaComponent.label} - organisation-name`)
  })
})
