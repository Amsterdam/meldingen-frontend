import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'

import { AddAttachment } from './AddAttachment'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'

global.URL.createObjectURL = vi.fn()
global.URL.revokeObjectURL = vi.fn()

const mockFile = new File(['dummy content'], 'example.png', { type: 'image/png' })

const defaultProps = {
  attachments: { files: [], key: 'attachments', term: 'attachments' },
  meldingId: 123,
}

window.confirm = vi.fn(() => true)

describe('AddAttachment', () => {
  it('renders correctly', () => {
    render(<AddAttachment {...defaultProps} />)

    const backLink = screen.getByRole('link', { name: 'back-link' })
    const heading = screen.getByRole('heading', { level: 1, name: 'title' })
    const uploadButton = screen.getByRole('button', { name: 'file-upload.drop-area file-upload.select-file-button' })
    const bottomLink = screen.getByRole('link', { name: 'cancel-link' })

    expect(backLink).toBeInTheDocument()
    expect(heading).toBeInTheDocument()
    expect(uploadButton).toBeInTheDocument()
    expect(bottomLink).toBeInTheDocument()
  })

  it('renders existing attachments and shows the back-link instead of the cancel-link', () => {
    render(
      <AddAttachment
        attachments={{
          files: [{ blob: new Blob(['x']), createdAt: '2025-01-01', fileName: 'existing.png', id: 7 }],
          key: 'attachments',
          term: 'attachments',
        }}
        meldingId={123}
      />,
    )

    const fileName = screen.getAllByText('existing.png')[0]
    const links = screen.getAllByRole('link', { name: 'back-link' })

    expect(fileName).toBeInTheDocument()
    expect(links).toHaveLength(2)
  })

  it('shows an empty aria-live region when no file has been deleted', () => {
    render(
      <AddAttachment
        attachments={{
          files: [{ blob: new Blob(['a']), createdAt: '2025-01-01', fileName: 'first.png', id: 1 }],
          key: 'attachments',
          term: 'attachments',
        }}
        meldingId={123}
      />,
    )

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

  it('shows an API error alert and a validation error when the upload fails', async () => {
    server.use(
      http.post(ENDPOINTS.POST_MELDING_BY_MELDING_ID_ATTACHMENT, () =>
        HttpResponse.json({ detail: 'Allowed content size exceeded' }, { status: 422 }),
      ),
    )

    const user = userEvent.setup()
    const { container } = render(<AddAttachment {...defaultProps} />)

    const fileInput = screen.getByLabelText('File input')

    await user.upload(fileInput, [mockFile])

    const validationLink = await screen.findByRole('link', { name: 'validation-errors.file-too-large' })

    expect(validationLink).toHaveAttribute('href', '#file-upload.id-prefix-1')
    expect(container.querySelectorAll('.ams-alert')[0]).toHaveTextContent('heading')

    // Both an API error alert and a validation error alert are shown; the validation alert
    // (mounted last, since it only appears once there's an errored file) ends up with focus.
    await waitFor(() => expect(container.querySelectorAll('.ams-alert')[1]).toHaveFocus())
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

  it('shows a delete notification and removes only the deleted file when deletion succeeds', async () => {
    const user = userEvent.setup()

    render(
      <AddAttachment
        attachments={{
          files: [
            { blob: new Blob(['a']), createdAt: '2025-01-01', fileName: 'first.png', id: 1 },
            { blob: new Blob(['b']), createdAt: '2025-01-01', fileName: 'second.png', id: 2 },
          ],
          key: 'attachments',
          term: 'attachments',
        }}
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
      http.delete(
        ENDPOINTS.DELETE_MELDING_BY_MELDING_ID_ATTACHMENT_BY_ATTACHMENT_ID,
        () => new HttpResponse('API error', { status: 404 }),
      ),
    )

    const user = userEvent.setup()

    const { container } = render(
      <AddAttachment
        attachments={{
          files: [{ blob: new Blob(['a']), createdAt: '2025-01-01', fileName: 'first.png', id: 1 }],
          key: 'attachments',
          term: 'attachments',
        }}
        meldingId={123}
      />,
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
})
