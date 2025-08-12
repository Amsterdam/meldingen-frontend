import { render, screen } from '@testing-library/react'

import Page from './page'

describe('Page', () => {
  it('renders page', async () => {
    const PageComponent = await Page()

    render(PageComponent)

    const heading = screen.getByRole('heading', { name: 'title' })
    const paragraph = screen.getByText('description')
    const link = screen.getByRole('link', { name: 'link' })

    expect(heading).toBeInTheDocument()
    expect(paragraph).toBeInTheDocument()
    expect(link).toBeInTheDocument()
  })
})
