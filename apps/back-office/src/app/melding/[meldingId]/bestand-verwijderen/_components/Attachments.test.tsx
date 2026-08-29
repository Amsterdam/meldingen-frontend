import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import type { MeldingAttachmentWithFile } from '../../types'

import { deleteAttachmentAction } from '../actions'
import { Attachments } from './Attachments'

type DeleteAttachmentActionResult = Awaited<ReturnType<typeof deleteAttachmentAction>>

vi.mock('../actions', () => ({
  deleteAttachmentAction: vi.fn(),
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
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('does not delete the attachment when confirmation is cancelled', async () => {
    const user = userEvent.setup()
    vi.spyOn(window, 'confirm').mockReturnValue(false)

    render(<Attachments initialAttachments={[createAttachment()]} />)

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

    render(
      <Attachments
        initialAttachments={[
          createAttachment({ id: 1, originalFilename: 'bewijs.png' }),
          createAttachment({ id: 2, originalFilename: 'foto.png' }),
        ]}
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
  })

  it('shows the delete error and keeps the attachment available when deletion fails', async () => {
    const user = userEvent.setup()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    vi.mocked(deleteAttachmentAction).mockResolvedValue({ error: 'Could not delete attachment', status: 500 })

    render(<Attachments initialAttachments={[createAttachment()]} />)

    await user.click(screen.getByRole('button', { name: 'bewijs.png' }))

    await waitFor(() => {
      expect(screen.getByText('Could not delete attachment')).toBeInTheDocument()
    })
    expect(screen.getByRole('button', { name: 'bewijs.png' })).toBeEnabled()
  })
})
