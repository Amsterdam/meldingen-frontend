import { render, screen } from '@testing-library/react'

import NotFound, { generateMetadata } from './not-found'

vi.mock('next-intl/server', () => ({
  getTranslations: () => Promise.resolve((key: string) => key),
}))

describe('generateMetadata', () => {
  it('returns the not-found metadata title', async () => {
    const metadata = await generateMetadata()

    expect(metadata).toEqual({ title: 'metadata.title' })
  })
})

describe('NotFound', () => {
  it('renders the translated title and description', async () => {
    render(await NotFound())

    expect(screen.getByRole('heading', { level: 1, name: 'title' })).toBeInTheDocument()
    expect(screen.getByText('description')).toBeInTheDocument()
  })
})
