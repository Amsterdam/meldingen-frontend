import type { Mock } from 'vitest'

import { render, screen } from '@testing-library/react'
import { useActionState } from 'react'

import { Location } from './Location'
import { containerAssets } from '~/mocks/data'

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...(typeof actual === 'object' ? actual : {}),
    useActionState: vi.fn().mockReturnValue([{}, vi.fn()]),
  }
})

const defaultProps = {
  prevPage: '/previous',
  selectedAssets: [],
}

describe('Location', () => {
  beforeEach(() => {
    ;(useActionState as Mock).mockReturnValue([{}, vi.fn()])
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

  it('renders saved assets', () => {
    render(<Location {...defaultProps} selectedAssets={containerAssets} />)

    const listItems = screen.getAllByRole('listitem')

    expect(listItems[0]).toHaveTextContent('Restafval container - Container-001')
    expect(listItems[1]).toHaveTextContent('Glas container - Container-002')
  })

  it('updates the document title when there are validation errors', () => {
    ;(useActionState as Mock).mockReturnValue([
      { validationErrors: [{ key: 'key1', message: 'Test error message' }] },
      vi.fn(),
    ])

    render(<Location {...defaultProps} />)

    expect(document.title).toBe('error-count-label question - organisation-name')
  })

  it('sets focus on InvalidFormAlert when there are validation errors', () => {
    ;(useActionState as Mock).mockReturnValue([
      { validationErrors: [{ key: 'key1', message: 'Test error message' }] },
      vi.fn(),
    ])

    const { container } = render(<Location {...defaultProps} />)

    const alert = container.querySelector('.ams-alert')

    expect(alert).toHaveFocus()
  })
})
