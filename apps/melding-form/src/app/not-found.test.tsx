import { render, screen } from '@testing-library/react'

import NotFound from './not-found'

describe('NotFound component', () => {
  it('renders the page title', async () => {
    const NotFoundComponent = await NotFound()

    render(NotFoundComponent)

    const title = screen.getByRole('heading', { level: 1, name: 'title' })

    expect(title).toBeInTheDocument()
  })

  it('renders the description', async () => {
    const NotFoundComponent = await NotFound()

    render(NotFoundComponent)

    const firstParagraph = screen.queryAllByRole('paragraph')[0]

    expect(firstParagraph).toHaveTextContent('description')
  })

  it('renders the link', async () => {
    const NotFoundComponent = await NotFound()

    render(NotFoundComponent)

    const link = screen.getByRole('link', { name: 'link' })

    expect(link).toBeInTheDocument()
  })
})
