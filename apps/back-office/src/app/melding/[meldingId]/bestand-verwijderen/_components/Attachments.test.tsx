import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'

import type { MeldingAttachmentWithFile } from '../../types'

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
    onDelete,
  }: {
    attachment: MeldingAttachmentWithFile
    isDeleting: boolean
    onDelete: () => void
  }) => (
    <button disabled={isDeleting} onClick={onDelete} type="button">
      {attachment.originalFilename}
    </button>
  ),
}))

const createAttachment = (overrides: Partial<MeldingAttachmentWithFile> = {}): MeldingAttachmentWithFile => ({
  blob: new Blob(['file-content'], { type: 'image/png' }),
  createdAt: '2024-01-01 10:30',
  id: 1,
  originalFilename: 'bewijs.png',
  updatedAt: '2024-01-01 10:30',
  user: {
    email: 'behandelaar@example.com',
    id: 10,
    username: 'behandelaar',
  },
  ...overrides,
})

describe('Attachments', () => {
  beforeEach(() => {
    vi.mocked(useRouter).mockReturnValue({ push: vi.fn() } as ReturnType<typeof useRouter>)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('does not delete the attachment when confirmation is cancelled', async () => {
    const user = userEvent.setup()
    vi.spyOn(window, 'confirm').mockReturnValue(false)

    render(<Attachments initialAttachments={[createAttachment()]} meldingId={123} />)

    await user.click(screen.getByRole('button', { name: 'bewijs.png' }))

    expect(deleteAttachmentAction).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'bewijs.png' })).toBeInTheDocument()
  })

  it('disables the attachment while the deletion request is pending and removes it on success', async () => {
    const user = userEvent.setup()
    vi.spyOn(window, 'confirm').mockReturnValue(true)

    let resolveDeletion: ((value: DeleteAttachmentActionResult) => void) | undefined
    vi.mocked(deleteAttachmentAction).mockReturnValue(
      new Promise((resolve) => {
        resolveDeletion = resolve
      }),
    )

    const push = vi.fn()
    vi.mocked(useRouter).mockReturnValue({ push } as ReturnType<typeof useRouter>)

    render(
      <Attachments
        initialAttachments={[
          createAttachment({ id: 1, originalFilename: 'bewijs.png' }),
          createAttachment({ id: 2, originalFilename: 'foto.png' }),
        ]}
        meldingId={123}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'bewijs.png' }))

    expect(deleteAttachmentAction).toHaveBeenCalledWith(1)
    expect(screen.getByRole('button', { name: 'bewijs.png' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'foto.png' })).toBeEnabled()

    resolveDeletion?.({ error: undefined, status: 204 })

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'bewijs.png' })).not.toBeInTheDocument()
    })
    expect(screen.getByRole('button', { name: 'foto.png' })).toBeInTheDocument()
    expect(push).not.toHaveBeenCalled()
  })

  it('shows the delete error and keeps the attachment available when deletion fails', async () => {
    const user = userEvent.setup()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    vi.mocked(deleteAttachmentAction).mockResolvedValue({ error: 'Could not delete attachment', status: 500 })

    render(<Attachments initialAttachments={[createAttachment()]} meldingId={123} />)

    await user.click(screen.getByRole('button', { name: 'bewijs.png' }))

    await waitFor(() => {
      expect(screen.getByText('Could not delete attachment')).toBeInTheDocument()
    })
    expect(screen.getByRole('button', { name: 'bewijs.png' })).toBeEnabled()
  })

  it('redirects to the detail page after deleting the last attachment', async () => {
    const user = userEvent.setup()
    const push = vi.fn()

    vi.mocked(useRouter).mockReturnValue({ push } as ReturnType<typeof useRouter>)
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    vi.mocked(deleteAttachmentAction).mockResolvedValue({ error: undefined, status: 204 })

    render(<Attachments initialAttachments={[createAttachment()]} meldingId={123} />)

    await user.click(screen.getByRole('button', { name: 'bewijs.png' }))

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/melding/123')
    })
  })
})
