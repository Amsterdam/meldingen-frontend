import { render, screen } from '@testing-library/react'
import { client } from 'libs/api-client/src/client.gen'
import { http, HttpResponse } from 'msw'
import { redirect } from 'next/navigation'
import { vi } from 'vitest'

import { Overview } from './Overview'
import Page from './page'
import { meldingen } from '../mocks/data'
import { ENDPOINTS } from '../mocks/endpoints'
import { server } from '../mocks/node'

vi.mock('./Overview', () => ({
  Overview: vi.fn(() => <div>Overview Component</div>),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

vi.mock('next-auth', () => ({
  getServerSession: vi.fn(() => Promise.resolve({})),
}))

// Vitest doesn't seem to pick up env vars in this app, for some reason.
// So we set a mock base URL directly in the test.
client.setConfig({
  baseUrl: 'http://localhost:3000',
})

describe('Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the Overview component with correct props', async () => {
    const searchParams = Promise.resolve({ pagina: '1' })

    const result = await Page({ searchParams })

    render(result)

    expect(Overview).toHaveBeenCalledWith(
      {
        data: meldingen,
        meldingCount: 40,
        page: 1,
        totalPages: 4,
      },
      {},
    )
  })

  it('redirects to the homepage if the page parameter is invalid', async () => {
    const searchParams = Promise.resolve({ pagina: 'invalid' })

    await Page({ searchParams })

    expect(redirect).toHaveBeenCalledWith('/')
  })

  it('redirects to the homepage if the page exceeds total pages', async () => {
    const searchParams = Promise.resolve({ pagina: '5' })

    await Page({ searchParams })

    expect(redirect).toHaveBeenCalledWith('/')
  })

  it('shows a message on API error', async () => {
    server.use(
      http.get(ENDPOINTS.MELDING, () =>
        HttpResponse.json({ detail: 'Error message' }, { status: 500, headers: { 'Content-Range': '0/40' } }),
      ),
    )

    const searchParams = Promise.resolve({ pagina: '1' })

    const result = await Page({ searchParams })

    render(result)

    expect(screen.getByText('Error message')).toBeInTheDocument()
  })
})
