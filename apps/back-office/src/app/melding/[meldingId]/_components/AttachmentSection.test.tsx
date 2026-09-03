import { render, screen } from '@testing-library/react'

import type { GetAttachmentsDataResult } from '../_utils/server/getAttachmentsData'
import type { MeldingAttachment } from '../types'

import { AttachmentSection } from './AttachmentSection'

vi.mock('./AttachmentPreview', () => ({
  AttachmentPreview: ({ fileName }: { blob: Blob | null; fileName: string }) => (
    <div data-testid="attachment-preview">{fileName}</div>
  ),
}))

const createAttachment = (overrides: Partial<MeldingAttachment> = {}) => ({
  blob: new Blob(['test-blob'], { type: 'image/jpeg' }),
  createdAt: '2025-10-01T12:00:00Z',
  id: 1,
  originalFilename: 'IMG_0815.jpg',
  updatedAt: '2025-10-01T12:00:00Z',
  ...overrides,
})

const defaultProps = {
  attachments: {
    attachmentsWithFile: [createAttachment()],
  },

  meldingId: 123,
}

describe('AttachmentSection', () => {
  it('renders the component with attachments', () => {
    render(<AttachmentSection {...defaultProps} />)

    expect(screen.getByText('attachments.title')).toBeInTheDocument()
    expect(screen.getByTestId('attachment-preview')).toHaveTextContent('IMG_0815.jpg')
    expect(screen.getAllByText('IMG_0815.jpg')).toHaveLength(2)
  })

  it('renders the component without attachments with no-data message', () => {
    const attachments: GetAttachmentsDataResult = { attachmentsWithFile: [] }

    render(<AttachmentSection {...defaultProps} attachments={attachments} />)

    expect(screen.getByText('attachments.title')).toBeInTheDocument()
    expect(screen.getByText('attachments.no-data')).toBeInTheDocument()
  })

  it('renders the add attachment link correctly', () => {
    render(<AttachmentSection {...defaultProps} />)

    const addAttachmentLink = screen.getByRole('link', { name: 'attachments.add-link' })
    expect(addAttachmentLink).toBeInTheDocument()

    expect(addAttachmentLink).toHaveAttribute('href', `/melding/${defaultProps.meldingId}/bestand-toevoegen`)
  })
})
