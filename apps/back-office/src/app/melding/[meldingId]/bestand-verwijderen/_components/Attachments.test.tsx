import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'

import type { MeldingAttachment } from '../../types'

import { RemoveAttachmentErrorProvider, useRemoveAttachmentError } from '../_context/RemoveAttachmentErrorContext'
import { deleteAttachmentAction } from '../actions'
import { Attachments } from './Attachments'

type DeleteAttachmentActionResult = Awaited<ReturnType<typeof deleteAttachmentAction>>

vi.mock('../actions', () => ({
  deleteAttachmentAction: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}))

vi.mock('./Attachment', () => ({
  Attachment: ({
    attachment,
    isDeleting,
    meldingId,
    onDelete,
  }: {
    attachment: MeldingAttachment
    isDeleting: boolean
    meldingId: number
    onDelete: () => void
  }) => (
    <button data-melding-id={meldingId} disabled={isDeleting} onClick={onDelete} type="button">
      {attachment.originalFilename}
    </button>
  ),
}))

const createAttachment = (overrides: Partial<MeldingAttachment> = {}): MeldingAttachment => ({
  blob: new Blob(['file-content'], { type: 'image/png' }),
  createdAt: '2024-01-01T10:30:00Z',
  id: 1,
  originalFilename: 'bewijs.png',
  updatedAt: '2024-01-01T10:30:00Z',
  user: {
    email: 'behandelaar@example.com',
    id: 10,
    username: 'behandelaar',
  },
  ...overrides,
})

const ApiErrorValue = () => {
  const { apiError } = useRemoveAttachmentError()

  return apiError ? <p>{apiError}</p> : null
}

const createMockRouter = (overrides: Partial<ReturnType<typeof useRouter>> = {}): ReturnType<typeof useRouter> => ({
  back: vi.fn(),
  forward: vi.fn(),
  prefetch: vi.fn(),
  push: vi.fn(),
  refresh: vi.fn(),
  replace: vi.fn(),
  ...overrides,
})

const renderAttachments = (attachments: MeldingAttachment[]) =>
  render(
    <RemoveAttachmentErrorProvider>
      <Attachments attachments={{ attachmentsWithFile: attachments }} meldingId={123} />
      <ApiErrorValue />
    </RemoveAttachmentErrorProvider>,
  )

describe('Attachments', () => {
  beforeEach(() => {
    vi.mocked(useRouter).mockReturnValue(createMockRouter())
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('does not delete the attachment when confirmation is cancelled', async () => {
    const user = userEvent.setup()
    vi.spyOn(window, 'confirm').mockReturnValue(false)

    renderAttachments([createAttachment()])

    await user.click(screen.getByRole('button', { name: 'bewijs.png' }))

    expect(deleteAttachmentAction).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'bewijs.png' })).toBeInTheDocument()
  })

  it('disables all attachments while the deletion request is pending and removes the deleted attachment on success', async () => {
    const user = userEvent.setup()
    vi.spyOn(window, 'confirm').mockReturnValue(true)

    let resolveDeletion: ((value: DeleteAttachmentActionResult) => void) | undefined
    vi.mocked(deleteAttachmentAction).mockReturnValue(
      new Promise((resolve) => {
        resolveDeletion = resolve
      }),
    )

    const replace = vi.fn()
    vi.mocked(useRouter).mockReturnValue(createMockRouter({ replace }))

    renderAttachments([
      createAttachment({ id: 1, originalFilename: 'bewijs.png' }),
      createAttachment({ id: 2, originalFilename: 'foto.png' }),
    ])

    await user.click(screen.getByRole('button', { name: 'bewijs.png' }))

    expect(deleteAttachmentAction).toHaveBeenCalledWith(1)
    expect(screen.getByRole('button', { name: 'bewijs.png' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'foto.png' })).toBeDisabled()

    resolveDeletion?.({ error: undefined, status: 204 })

    expect(await screen.findByText('confirmation')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'bewijs.png' })).not.toBeInTheDocument()
    })
    expect(screen.getByRole('button', { name: 'foto.png' })).toBeInTheDocument()
    expect(replace).not.toHaveBeenCalled()
  })

  it('shows the delete error and keeps the attachment available when deletion fails', async () => {
    const user = userEvent.setup()

    vi.spyOn(window, 'confirm').mockReturnValue(true)
    vi.mocked(deleteAttachmentAction).mockResolvedValue({ error: 'Could not delete attachment', status: 500 })

    renderAttachments([createAttachment()])

    await user.click(screen.getByRole('button', { name: 'bewijs.png' }))

    await waitFor(() => {
      expect(screen.getByText('Could not delete attachment')).toBeInTheDocument()
    })
    expect(screen.getByRole('button', { name: 'bewijs.png' })).toBeEnabled()
  })

  it('redirects to the detail page after deleting the last attachment', async () => {
    const user = userEvent.setup()
    const replace = vi.fn()

    vi.mocked(useRouter).mockReturnValue(createMockRouter({ replace }))
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    vi.mocked(deleteAttachmentAction).mockResolvedValue({ error: undefined, status: 204 })

    renderAttachments([createAttachment()])

    await user.click(screen.getByRole('button', { name: 'bewijs.png' }))

    await waitFor(() => {
      expect(replace).toHaveBeenCalledWith('/melding/123')
    })
  })
})
