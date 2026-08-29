import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import type { MeldingAttachmentWithFile } from '../../types'

import { Attachment } from './Attachment'

vi.mock('../../_components/AttachmentPreview', () => ({
  AttachmentPreview: ({ fileName }: { blob: Blob | null; fileName: string }) => (
    <div data-testid="attachment-preview">{fileName}</div>
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

describe('Attachment', () => {
  it('renders the attachment details and handles deletion', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()

    render(<Attachment attachment={createAttachment()} isDeleting={false} onDelete={onDelete} />)

    expect(screen.getAllByText('bewijs.png')).toHaveLength(2)
    expect(screen.getByText('2024-01-01 10:30')).toBeInTheDocument()
    expect(screen.getByText('behandelaar@example.com')).toBeInTheDocument()
    expect(screen.getByTestId('attachment-preview')).toHaveTextContent('bewijs.png')

    await user.click(screen.getByRole('button', { name: 'submit-button' }))

    expect(onDelete).toHaveBeenCalledTimes(1)
  })

  it('renders the melding form fallback user and disables the delete button while deleting', () => {
    render(<Attachment attachment={createAttachment({ user: undefined })} isDeleting={true} onDelete={vi.fn()} />)

    expect(screen.getByText('attachments.melding-form-user')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'submit-button' })).toBeDisabled()
  })
})
