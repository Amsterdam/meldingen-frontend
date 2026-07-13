import { render, screen } from '@testing-library/react'

import { NotesOverview } from './NotesOverview'

const defaultProps = {
  meldingId: 123,
  notes: [],
  publicId: 'B100AA',
}

describe('NotesOverview', () => {
  it('renders the component', () => {
    render(<NotesOverview {...defaultProps} />)

    expect(screen.getByText('back-link')).toBeInTheDocument()
    expect(screen.getByText('title')).toBeInTheDocument()
  })
})
