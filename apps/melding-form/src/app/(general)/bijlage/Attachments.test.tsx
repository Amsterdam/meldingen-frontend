import type { Mock } from 'vitest'

import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { delay, http, HttpResponse } from 'msw'
import { useActionState } from 'react'

import type { Props } from './Attachments'

import { Attachments } from './Attachments'
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

// TODO: Check if we can do this somewhere else
// `process.env.NEXT_PUBLIC_BACKEND_BASE_URL` isn't loaded from `.env` in the vitest environment.
// Attachments builds the upload XHR's URL from it, so it needs to resolve to something msw's
// relative-path handlers can match. jsdom's default origin (also used by msw to resolve relative
// handler paths) is http://localhost:3000, so we set it to that here.
process.env.NEXT_PUBLIC_BACKEND_BASE_URL = 'http://localhost:3000'

const mockFile = new File(['dummy content'], 'example.png', { type: 'image/png' })

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
      name: 'First question hint-text file-upload.drop-area file-upload.button',
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

  it('renders an Invalid Form Alert, focuses it and updates the document title when there are validation errors', async () => {
    server.use(
      http.post(ENDPOINTS.POST_MELDING_BY_MELDING_ID_ATTACHMENT, () =>
        HttpResponse.json({ detail: 'Allowed content size exceeded' }, { status: 422 }),
      ),
    )

    const { container } = render(<Attachments {...defaultProps} />)

    const fileInput = screen.getByLabelText('File input')

    // Using fireEvent instead of userEvent.upload here, because userEvent simulates the browser
    // restoring focus to the file input once the (simulated) file picker closes. That happens
    // after our change handler runs, so it would overwrite the focus we set on the alert and mask
    // the behaviour under test.
    fireEvent.change(fileInput, { target: { files: [mockFile] } })

    const link = await screen.findByRole('link', { name: 'validation-errors.file-too-large' })
    const alert = container.querySelector('.ams-alert')

    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '#file-upload.id-prefix-1')
    await waitFor(() => expect(alert).toHaveFocus())

    expect(document.title).toBe(`document-title-error-count-prefix ${textAreaComponent.label} - organisation-name`)
  })

  it('renders a generic error Alert, focuses it and updates the document title when there is a generic error', () => {
    const { container } = render(<Attachments {...defaultProps} />)

    const fileInput = screen.getByLabelText('File input')

    const file = new File(['dummy content'], 'example.png', { type: 'image/png' })
    const file2 = new File(['dummy content two'], 'example2.png', { type: 'image/png' })
    const file3 = new File(['dummy content three'], 'example3.png', { type: 'image/png' })
    const file4 = new File(['dummy content four'], 'example4.png', { type: 'image/png' })

    // Using fireEvent instead of userEvent.upload here, because userEvent simulates the browser
    // restoring focus to the file input once the (simulated) file picker closes. That happens
    // after our change handler runs, so it would overwrite the focus we set on the alert and mask
    // the behaviour under test.
    fireEvent.change(fileInput, { target: { files: [file, file2, file3, file4] } })

    const alert = container.querySelector('.ams-alert')

    expect(alert).toHaveTextContent('errors.too-many-files.title')
    expect(alert).toHaveFocus()

    expect(document.title).toBe(`api-error-alert.heading - ${textAreaComponent.label} - organisation-name`)
  })

  it('renders an empty aria-live region when no file is deleted', () => {
    render(<Attachments {...defaultProps} />)

    const liveRegion = document.querySelector('[aria-live="polite"]')

    expect(liveRegion).toBeInTheDocument()
    expect(liveRegion).toBeEmptyDOMElement()
  })

  it('renders an aria-live region with a notification when a file is deleted', async () => {
    const user = userEvent.setup()

    render(<Attachments {...defaultProps} />)

    const fileInput = screen.getByLabelText('File input')

    await user.upload(fileInput, [mockFile])

    const deleteButton = await screen.findByRole('button', {
      name: `file-upload.action-button-delete ${mockFile.name}`,
    })

    await user.click(deleteButton)

    const liveRegion = await screen.findByText('delete-notification')

    expect(liveRegion).toBeInTheDocument()
  })

  it('cancels an in-progress upload and removes it from the file list with the cancel button', async () => {
    // This is more or less an integration test, to make sure the XHR reference from fileUploads is passed back to handleDelete correctly
    server.use(
      http.post(ENDPOINTS.POST_MELDING_BY_MELDING_ID_ATTACHMENT, async () => {
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

  it('shows a generic error Alert when delete request fails', async () => {
    server.use(
      http.delete(
        ENDPOINTS.DELETE_MELDING_BY_MELDING_ID_ATTACHMENT_BY_ATTACHMENT_ID,
        () => new HttpResponse(null, { status: 404 }),
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
  })

  it('shows a generic error Alert when trying to navigate to the next page while an upload is in progress', async () => {
    server.use(
      http.post(ENDPOINTS.POST_MELDING_BY_MELDING_ID_ATTACHMENT, async () => {
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
  })
})
