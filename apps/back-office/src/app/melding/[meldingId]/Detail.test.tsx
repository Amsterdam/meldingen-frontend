import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { Detail } from './Detail'

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...(typeof actual === 'object' ? actual : {}),
    useActionState: vi.fn().mockReturnValue([{}, vi.fn()]),
    startTransition: vi.fn((callback) => callback()),
  }
})

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

    expect(screen.getByText('Term 1')).toBeInTheDocument()
    expect(screen.getByText('Description 1')).toBeInTheDocument()
    expect(screen.getByText('Term 2')).toBeInTheDocument()
    expect(screen.getByText('Description 2')).toBeInTheDocument()
  })

  it('renders the state data', () => {
    render(<Detail {...defaultProps} />)

    expect(screen.getByText('term')).toBeInTheDocument()
    expect(screen.getByText('processing')).toBeInTheDocument()

    const link = screen.getByRole('link', { name: 'link' })

    expect(link).toBeInTheDocument()
  })
})
