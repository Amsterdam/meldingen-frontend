import { render, screen } from '@testing-library/react'

import { getFullNLAddress } from '../../utils'
import { Detail } from './Detail'
import { melding } from 'apps/back-office/src/mocks/data'

vi.mock('./_components/AttachmentImage', () => ({
  AttachmentImage: vi.fn(() => <div>AttachmentsImage</div>),
}))

const defaultProps = {
  additionalQuestionsWithMeldingText: [
    { description: 'Test melding description', key: 'text', term: 'Test melding text' },
    { description: 'Description 1', key: '1', term: 'Term 1' },
    { description: 'Description 2', key: '2', term: 'Term 2' },
    { description: 'Description 3', key: '3', term: 'Term 3' },
  ],
  attachments: {
    files: [{ blob: new Blob(['test-blob'], { type: 'image/jpeg' }), fileName: 'IMG_0815.jpg' }],
    key: 'attachments',
    term: 'detail.attachments.title',
  },
  meldingData: [
    { description: '2023-10-01', key: 'created_at', term: 'Created at' },
    { description: 'Test classification', key: 'classification', term: 'Classification' },
    {
      description: 'processing',
      key: 'state',
      link: { href: '/melding/123/wijzig-status', label: 'Change state' },
      term: 'State',
    },
  ],
  meldingId: 123,
  publicId: 'B100AA',
}

describe('Detail', () => {
  it('renders the component', () => {
    render(<Detail {...defaultProps} />)

    expect(screen.getByText('back-link')).toBeInTheDocument()
    expect(screen.getByText('title')).toBeInTheDocument()
  })

  it('renders the additional questions with melding text', () => {
    render(<Detail {...defaultProps} />)
    expect(screen.getByText('Test melding text')).toBeInTheDocument()
    expect(screen.getByText('Test melding description')).toBeInTheDocument()
    expect(screen.getByText('Term 1')).toBeInTheDocument()
    expect(screen.getByText('Description 1')).toBeInTheDocument()
    expect(screen.getByText('Term 2')).toBeInTheDocument()
    expect(screen.getByText('Description 2')).toBeInTheDocument()
    expect(screen.getByText('Term 3')).toBeInTheDocument()
    expect(screen.getByText('Description 3')).toBeInTheDocument()
  })

  it('renders the contact data', () => {
    render(
      <Detail
        {...defaultProps}
        contact={[
          { description: 'email@email.email', key: 'email', term: 'Email' },
          { description: '1234567890', key: 'phone', term: 'Phone' },
        ]}
      />,
    )
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('email@email.email')).toBeInTheDocument()
    expect(screen.getByText('Phone')).toBeInTheDocument()
    expect(screen.getByText('1234567890')).toBeInTheDocument()
  })

  it('renders the location data', () => {
    render(
      <Detail
        {...defaultProps}
        location={[{ description: getFullNLAddress(melding)!, key: 'address', term: 'location.address' }]}
      />,
    )

    expect(screen.getByText('location.address')).toBeInTheDocument()
    expect(screen.getByText(getFullNLAddress(melding)!)).toBeInTheDocument()
  })

  it('renders the melding data', () => {
    render(<Detail {...defaultProps} />)

    expect(screen.getByText('Created at')).toBeInTheDocument()
    expect(screen.getByText('2023-10-01')).toBeInTheDocument()
    expect(screen.getByText('Classification')).toBeInTheDocument()
    expect(screen.getByText('Test classification')).toBeInTheDocument()
    expect(screen.getByText('State')).toBeInTheDocument()
    expect(screen.getByText('processing')).toBeInTheDocument()

    const link = screen.getByRole('link', { name: 'Change state' })

    expect(link).toBeInTheDocument()
  })

  it('renders the attachments', () => {
    render(<Detail {...defaultProps} />)

    expect(screen.getByText('attachments.title')).toBeInTheDocument()
    expect(screen.getByText('AttachmentsImage')).toBeInTheDocument()
  })

  it('renders a no-data message when there are no attachments', () => {
    const attachments = {
      files: [],
      key: 'attachments',
      term: 'detail.attachments.title',
    }

    render(<Detail {...defaultProps} attachments={attachments} />)

    expect(screen.getByText('attachments.title')).toBeInTheDocument()
    expect(screen.getByText('attachments.no-data')).toBeInTheDocument()
  })
})
