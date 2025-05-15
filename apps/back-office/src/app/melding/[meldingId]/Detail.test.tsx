import { render, screen } from '@testing-library/react'

import { Detail } from './Detail'

const defaultProps = {
  meldingData: [
    { key: '1', term: 'Term 1', description: 'Description 1' },
    { key: '2', term: 'Term 2', description: 'Description 2' },
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
  })

  it('renders the state data', () => {
    render(<Detail {...defaultProps} />)

    expect(screen.getByText('state.term')).toBeInTheDocument()
    expect(screen.getByText('processing')).toBeInTheDocument()

    const link = screen.getByRole('link', { name: 'state.link' })

    expect(link).toBeInTheDocument()
  })
})
