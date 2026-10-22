import { render, screen } from '@testing-library/react'

import Page, { generateMetadata } from './page'
import { getClientEnv } from '~/env/client'

vi.mock('next-intl/server', async () => ({
  getTranslations: () =>
    vi.fn().mockImplementation((key, params) => (params ? `${key}:${JSON.stringify(params)}` : key)),
}))

describe('generateMetadata', () => {
  it('returns the correct metadata title', async () => {
    const metadata = await generateMetadata()

    expect(metadata).toEqual({ title: 'metadata.title' })
  })
})

describe('Page', () => {
  it('renders page', async () => {
    const searchParams = Promise.resolve({ created_at: '2025-05-26T11:56:34.081Z', public_id: '1234' })

    const PageComponent = await Page({ searchParams })

    render(PageComponent)

    const heading = screen.getByRole('heading', { name: 'title' })
    const paragraph = screen.getByText('description:{"date":"26-05-2025","publicId":"1234","time":"13:56"}')
    const link = screen.getByRole('link', { name: 'link' })

    expect(heading).toBeInTheDocument()
    expect(paragraph).toBeInTheDocument()
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/#top')
  })

  it('uses the first value when search params are arrays', async () => {
    const searchParams = Promise.resolve({
      created_at: ['2025-05-26T11:56:34.081Z', '2026-01-01T00:00:00.000Z'],
      public_id: ['1234', '5678'],
    })

    const PageComponent = await Page({ searchParams })

    render(PageComponent)

    const paragraph = screen.getByText('description:{"date":"26-05-2025","publicId":"1234","time":"13:56"}')

    expect(paragraph).toBeInTheDocument()
  })

  it('renders a description without publicId', async () => {
    const searchParams = Promise.resolve({ created_at: '2025-05-26T11:56:34.081Z', public_id: undefined })

    const PageComponent = await Page({ searchParams })

    render(PageComponent)

    const description = screen.getByText('description:{"date":"26-05-2025","time":"13:56"}')

    expect(description).toBeInTheDocument()
  })

  it('renders a description without date and time', async () => {
    const searchParams = Promise.resolve({ created_at: undefined, public_id: '1234' })

    const PageComponent = await Page({ searchParams })

    render(PageComponent)

    const description = screen.getByText('description:{"publicId":"1234"}')

    expect(description).toBeInTheDocument()
  })

  it('renders the publicId as a link when source is back-office', async () => {
    const searchParams = Promise.resolve({
      created_at: '2025-05-26T11:56:34.081Z',
      id: '10',
      public_id: '1234',
      source: 'back-office',
    })

    const PageComponent = await Page({ searchParams })

    render(PageComponent)

    const link = screen.getByRole('link', { name: '1234' })

    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', `${getClientEnv().NEXT_PUBLIC_BACK_OFFICE_BASE_URL}/melding/10?id=1234`)
  })

  it('uses the first source value when source is an array', async () => {
    const searchParams = Promise.resolve({
      created_at: '2025-05-26T11:56:34.081Z',
      id: '10',
      public_id: '1234',
      source: ['back-office', 'melding-form'],
    })

    const PageComponent = await Page({ searchParams })

    render(PageComponent)

    const link = screen.getByRole('link', { name: '1234' })

    expect(link).toHaveAttribute('href', `${getClientEnv().NEXT_PUBLIC_BACK_OFFICE_BASE_URL}/melding/10?id=1234`)
  })

  it('links to the back-office melden page when source is back-office', async () => {
    const searchParams = Promise.resolve({
      created_at: '2025-05-26T11:56:34.081Z',
      id: '10',
      public_id: '1234',
      source: 'back-office',
    })

    const PageComponent = await Page({ searchParams })

    render(PageComponent)

    const link = screen.getByRole('link', { name: 'link' })

    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', `${getClientEnv().NEXT_PUBLIC_BACK_OFFICE_BASE_URL}/melden`)
  })
})
