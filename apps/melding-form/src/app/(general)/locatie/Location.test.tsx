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
    ;(useActionState as Mock).mockReturnValue([{}, vi.fn()])
  })

  it('renders', () => {
    render(<Location {...defaultProps} />)

    const header = screen.getByRole('banner', { name: 'title' })

    expect(header).toBeInTheDocument()
  })

  it('renders the back link', () => {
    render(<Location {...defaultProps} />)

    const link = screen.getByRole('link', { name: 'back-link' })

    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/previous')
  })

  it('does not render an error message when there is none', () => {
    render(<Location {...defaultProps} />)

    const alert = screen.queryByRole('alert')

    expect(alert).not.toBeInTheDocument()
  })

  it('renders a system error Alert when there is one', () => {
    ;(useActionState as Mock).mockReturnValue([{ systemError: 'Test error message' }, vi.fn()])

    render(<Location {...defaultProps} />)

    const alert = screen.getByRole('alert')

    expect(alert).toHaveTextContent('system-error-alert-title')
  })

  it('renders an Invalid Form Alert when there are validation errors', () => {
    ;(useActionState as Mock).mockReturnValue([
      { validationErrors: [{ key: 'key1', message: 'Test error message' }] },
      vi.fn(),
    ])

    render(<Location {...defaultProps} />)

    const link = screen.getByRole('link', { name: 'Test error message' })

    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '#key1')
  })

  it('renders the default text when there is no address', () => {
    render(<Location {...defaultProps} />)

    const paragraph = screen.getByText('description')

    expect(paragraph).toBeInTheDocument()
  })

  it('renders an address when it is provided', () => {
    render(<Location {...defaultProps} address="Oudezijds Voorburgwal 300, 1012GL Amsterdam" />)

    const paragraph = screen.getByText('Oudezijds Voorburgwal 300, 1012GL Amsterdam')

    expect(paragraph).toBeInTheDocument()
  })

  it('renders a link with the default text when there is no location data', () => {
    render(<Location {...defaultProps} />)

    const link = screen.getByRole('link', { name: 'link.without-location' })

    expect(link).toBeInTheDocument()
  })

  it('renders a link with updated text when there is location data', () => {
    render(<Location {...defaultProps} address="Oudezijds Voorburgwal 300, 1012GL Amsterdam" />)

    const link = screen.getByRole('link', { name: 'link.with-location' })

    expect(link).toBeInTheDocument()
  })
})
