import { render, screen } from '@testing-library/react'

import NotFound, { generateMetadata } from './not-found'

describe('generateMetadata', () => {
  it('returns the correct metadata title', async () => {
    const metadata = await generateMetadata()

    expect(metadata).toEqual({ title: 'metadata.title' })
  })
})

describe('NotFound page', () => {
  it('renders the page title', async () => {
    const NotFoundPage = await NotFound()

    render(NotFoundPage)

    const title = screen.getByRole('heading', { level: 1, name: 'title' })

    expect(title).toBeInTheDocument()
  })

  it('renders the description', async () => {
    const NotFoundPage = await NotFound()

    render(NotFoundPage)

    const firstParagraph = screen.queryAllByRole('paragraph')[0]

    expect(firstParagraph).toHaveTextContent('description')
  })

  it('renders the link', async () => {
    const NotFoundPage = await NotFound()

    render(NotFoundPage)

    const link = screen.getByRole('link', { name: 'link' })

    expect(link).toBeInTheDocument()
  })
})
