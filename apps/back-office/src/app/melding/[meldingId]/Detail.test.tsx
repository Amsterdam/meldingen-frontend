import { render, screen } from '@testing-library/react'

import { Detail } from './Detail'

const defaultProps = {
  additionalQuestionsWithMeldingText: [
    { key: 'text', term: 'term.text', description: 'description.text' },
    { key: '1', term: 'Term 1', description: 'Description 1' },
  ],
  meldingData: [
    { key: '1', term: 'Term 2', description: 'Description 2' },
    { key: '2', term: 'Term 3', description: 'Description 3' },
  ],
  meldingId: 123,
  meldingState: 'processing',
}

describe('Detail', () => {
  it('renders the component with melding data', () => {
    render(<Detail {...defaultProps} />)

    expect(screen.getByText('back-link')).toBeInTheDocument()
    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('Term 1')).toBeInTheDocument()
    expect(screen.getByText('Description 1')).toBeInTheDocument()
    expect(screen.getByText('Term 2')).toBeInTheDocument()
    expect(screen.getByText('Description 2')).toBeInTheDocument()
    expect(screen.getByText('Term 3')).toBeInTheDocument()
    expect(screen.getByText('Description 3')).toBeInTheDocument()
  })

  it('renders the state data', () => {
    render(<Detail {...defaultProps} />)

    expect(screen.getByText('state.term')).toBeInTheDocument()
    expect(screen.getByText('processing')).toBeInTheDocument()

    const link = screen.getByRole('link', { name: 'state.link' })

    expect(link).toBeInTheDocument()
  })
})
