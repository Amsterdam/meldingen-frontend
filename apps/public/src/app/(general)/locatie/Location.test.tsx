import { render, screen } from '@testing-library/react'
import { useActionState } from 'react'
import type { Mock } from 'vitest'

import { Location } from './Location'

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...(typeof actual === 'object' ? actual : {}),
    useActionState: vi.fn().mockReturnValue([{}, vi.fn()]),
  }
})

const defaultProps = {
  prevPage: '/previous',
}

describe('Location', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(useActionState as Mock).mockReturnValue([{}, vi.fn()])
  })

  it('renders', () => {
    render(<Location {...defaultProps} />)

    const heading = screen.getByRole('heading', { name: 'step.title' })

    expect(heading).toBeInTheDocument()
  })

  it('renders the correct backlink', () => {
    render(<Location {...defaultProps} />)

    const backLink = screen.getByRole('link', { name: 'back-link' })

    expect(backLink).toBeInTheDocument()
    expect(backLink).toHaveAttribute('href', '/previous')
  })

  it('does not render an error message when there is none', () => {
    render(<Location {...defaultProps} />)

    const errorMessage = screen.queryByText('Test error message')

    expect(errorMessage).not.toBeInTheDocument()
  })

  it('renders an error message when there is one', () => {
    ;(useActionState as Mock).mockReturnValue([{ message: 'Test error message' }, vi.fn()])

    render(<Location {...defaultProps} />)
    const errorMessage = screen.getByText('Test error message')

    expect(errorMessage).toBeInTheDocument()
  })

  it('renders the default text when there is no location data', () => {
    render(<Location {...defaultProps} />)

    const paragraph = screen.getByText('description')

    expect(paragraph).toBeInTheDocument()
  })

  it('renders the location data name when it is provided', () => {
    render(<Location {...defaultProps} locationData={{ name: 'Test location' }} />)

    const paragraph = screen.getByText('Test location')

    expect(paragraph).toBeInTheDocument()
  })

  it('renders a link with the default text when there is no location data', () => {
    render(<Location {...defaultProps} />)

    const link = screen.getByRole('link', { name: 'link.without-location' })

    expect(link).toBeInTheDocument()
  })

  it('renders a link with updated text when there is location data', () => {
    render(<Location {...defaultProps} locationData={{ name: 'Test location' }} />)

    const link = screen.getByRole('link', { name: 'link.with-location' })

    expect(link).toBeInTheDocument()
  })
})
