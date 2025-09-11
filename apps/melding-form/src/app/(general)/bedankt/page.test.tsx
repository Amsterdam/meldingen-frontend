import { render, screen } from '@testing-library/react'
import { redirect } from 'next/navigation'

import Page, { generateMetadata } from './page'
import { mockCookies } from 'apps/melding-form/src/mocks/utils'

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
    mockCookies({ public_id: '1234', created_at: '2025-05-26T11:56:34.081Z' })

    const PageComponent = await Page()

    render(PageComponent)

    const heading = screen.getByRole('heading', { name: 'title' })
    const paragraph = screen.getByText('description:{"publicId":"1234","date":"26-5-2025","time":"11:56"}')
    const link = screen.getByRole('link', { name: 'link' })

    expect(redirect).not.toHaveBeenCalledWith('/')
    expect(heading).toBeInTheDocument()
    expect(paragraph).toBeInTheDocument()
    expect(link).toBeInTheDocument()
  })

  it('should render description without publicId', async () => {
    mockCookies({ public_id: undefined, created_at: '2025-05-26T11:56:34.081Z' })

    const PageComponent = await Page()

    render(PageComponent)

    const description = screen.getByText('description:{"date":"26-5-2025","time":"11:56"}')

    expect(description).toBeInTheDocument()
  })

  it('should render description without date and time', async () => {
    mockCookies({ public_id: '1234', created_at: undefined })

    const PageComponent = await Page()

    render(PageComponent)

    const description = screen.getByText('description:{"publicId":"1234"}')

    expect(description).toBeInTheDocument()
  })
})
