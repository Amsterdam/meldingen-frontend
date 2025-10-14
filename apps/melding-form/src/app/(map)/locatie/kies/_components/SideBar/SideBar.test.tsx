import { render, screen } from '@testing-library/react'

import { SideBar } from './SideBar'

describe('SideBar', () => {
  it('should render correctly', () => {
    render(<SideBar />)

    const BackLink = screen.getByRole('link', { name: 'back-link' })
    const heading = screen.getByRole('heading', { name: 'title' })
    const description = screen.getAllByText('description')

    expect(BackLink).toBeInTheDocument()
    expect(heading).toBeInTheDocument()
    expect(description[0]).toBeInTheDocument()
  })
})
