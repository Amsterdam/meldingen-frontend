import { render, screen } from '@testing-library/react'

import { SideBarTop } from './SideBarTop'

describe('SideBarTop', () => {
  it('should render correctly', () => {
    render(<SideBarTop />)

    const backLink = screen.getByRole('link', { name: 'back-link' })
    const heading = screen.getByRole('heading', { name: 'title' })
    const description = screen.getByText('description')

    expect(backLink).toBeInTheDocument()
    expect(heading).toBeInTheDocument()
    expect(description).toBeInTheDocument()
  })
})
