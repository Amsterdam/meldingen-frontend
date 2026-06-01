import { render, screen } from '@testing-library/react'
import { redirect } from 'next/navigation'

import Page, { generateMetadata } from './page'

vi.mock('next/headers', () => ({ cookies: vi.fn() }))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

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
    const paragraph = screen.getByText('description:{"date":"26-5-2025","publicId":"1234","time":"11:56"}')
    const link = screen.getByRole('link', { name: 'link' })

    expect(redirect).not.toHaveBeenCalledWith('/')
    expect(heading).toBeInTheDocument()
    expect(paragraph).toBeInTheDocument()
    expect(link).toBeInTheDocument()
  })

  it('renders a description without publicId', async () => {
    const searchParams = Promise.resolve({ created_at: '2025-05-26T11:56:34.081Z', public_id: undefined })

    const PageComponent = await Page({ searchParams })

    render(PageComponent)

    const description = screen.getByText('description:{"date":"26-5-2025","time":"11:56"}')

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
    vi.stubEnv('NEXT_PUBLIC_BACK_OFFICE_BASE_URL', 'https://backoffice.example.com')

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
    expect(link).toHaveAttribute('href', 'https://backoffice.example.com/melding/10?id=1234')

    vi.unstubAllEnvs()
  })

  it('links to the back-office melden page when source is back-office', async () => {
    vi.stubEnv('NEXT_PUBLIC_BACK_OFFICE_BASE_URL', 'https://backoffice.example.com')

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
    expect(link).toHaveAttribute('href', 'https://backoffice.example.com/melden')

    vi.unstubAllEnvs()
  })
})
