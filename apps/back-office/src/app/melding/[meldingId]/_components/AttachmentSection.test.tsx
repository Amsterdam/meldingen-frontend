import { render, screen } from '@testing-library/react'

import { AttachmentSection } from './AttachmentSection'

const defaultProps = {
  attachments: {
    files: [
      {
        blob: new Blob(['test-blob'], { type: 'image/jpeg' }),
        createdAt: '2025-10-01T12:00:00Z',
        fileName: 'IMG_0815.jpg',
      },
    ],
    key: 'attachments',
    term: 'detail.attachments.title',
  },

  meldingId: 123,
}

describe('AttachmentSection', () => {
  it('renders the component with attachments', () => {
    render(<AttachmentSection {...defaultProps} />)

    expect(screen.getByText('attachments.title')).toBeInTheDocument()
    expect(screen.getByText('IMG_0815.jpg')).toBeInTheDocument()
  })

  it('renders the component without attachments with no-data message', () => {
    const attachments = {
      files: [],
      key: 'attachments',
      term: 'detail.attachments.title',
    }

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
