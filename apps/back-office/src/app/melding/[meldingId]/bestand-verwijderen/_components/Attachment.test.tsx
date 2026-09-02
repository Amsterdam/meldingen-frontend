import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import type { MeldingAttachment } from '../../types'

import { Attachment } from './Attachment'

vi.mock('../../_components/AttachmentPreview', () => ({
  AttachmentPreview: ({ fileName }: { blob: Blob | null; fileName: string; id: number; meldingId: number }) => (
    <div data-testid="attachment-preview">{fileName}</div>
  ),
}))

const createAttachment = (overrides: Partial<MeldingAttachment> = {}): MeldingAttachment => ({
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

    render(<Attachment attachment={createAttachment()} isDeleting={false} meldingId={123} onDelete={onDelete} />)

    expect(screen.getAllByText('bewijs.png')).toHaveLength(2)
    expect(screen.getByText('2024-01-01 10:30')).toBeInTheDocument()
    expect(screen.getByText('behandelaar@example.com')).toBeInTheDocument()
    expect(screen.getByTestId('attachment-preview')).toHaveTextContent('bewijs.png')

    await user.click(screen.getByRole('button', { name: 'remove.submit-button bewijs.png' }))

    expect(onDelete).toHaveBeenCalledTimes(1)
  })

  it('renders the melding form fallback user and disables the delete button while deleting', () => {
    render(
      <Attachment
        attachment={createAttachment({ user: undefined })}
        isDeleting={true}
        meldingId={123}
        onDelete={vi.fn()}
      />,
    )

    expect(screen.getByText('melding-form-user')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'remove.submit-button bewijs.png' })).toBeDisabled()
  })
})
