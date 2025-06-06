import { render, screen } from '@testing-library/react'

import { Detail } from './Detail'
import { getFullNLAddress } from '../../utils'
import { melding } from 'apps/back-office/src/mocks/data'

const defaultProps = {
  additionalQuestionsWithMeldingText: [
    { key: 'text', term: 'Test melding text', description: 'Test melding description' },
    { key: '1', term: 'Term 1', description: 'Description 1' },
    { key: '2', term: 'Term 2', description: 'Description 2' },
    { key: '3', term: 'Term 3', description: 'Description 3' },
  ],
  meldingData: [
    { key: 'created_at', term: 'Created at', description: '2023-10-01' },
    { key: 'classification', term: 'Classification', description: 'Test classification' },
    {
      key: 'state',
      term: 'State',
      description: 'processing',
      link: { href: '/melding/123/wijzig-status', label: 'Change state' },
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
          { key: 'email', term: 'Email', description: 'email@email.email' },
          { key: 'phone', term: 'Phone', description: '1234567890' },
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
        location={[{ key: 'address', term: 'location.address', description: getFullNLAddress(melding)! }]}
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
})
