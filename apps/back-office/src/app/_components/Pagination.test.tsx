import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import { Pagination } from './Pagination'

vi.mock('./PageSizeSelect', () => ({
  PageSizeSelect: () => <div>PageSizeSelect</div>,
}))

describe('Pagination', () => {
  it('renders the current page text, pagination, and the PageSizeSelect', () => {
    render(<Pagination page={2} pageSize={20} totalPages={5} />)

    expect(screen.getByText('current-page')).toBeInTheDocument()
    expect(screen.getByText('PageSizeSelect')).toBeInTheDocument()

    // Pagination should render a navigation landmark
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('does not render the current page text when totalPages is 1', () => {
    render(<Pagination page={1} pageSize={10} totalPages={1} />)

    expect(screen.queryByText('current-page')).not.toBeInTheDocument()
    expect(screen.getByText('PageSizeSelect')).toBeInTheDocument()
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it('renders the current page text when totalPages is 4 but page is undefined', () => {
    render(<Pagination page={undefined} pageSize={10} totalPages={4} />)

    expect(screen.getByText('current-page')).toBeInTheDocument()
    expect(screen.getByText('PageSizeSelect')).toBeInTheDocument()
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('renders when totalPages is 5 but page is 0', () => {
    render(<Pagination page={0} pageSize={10} totalPages={5} />)

    expect(screen.getByText('current-page')).toBeInTheDocument()
    expect(screen.getByText('PageSizeSelect')).toBeInTheDocument()
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })
})
