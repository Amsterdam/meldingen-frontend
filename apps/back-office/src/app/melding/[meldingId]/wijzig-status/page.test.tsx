import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { vi } from 'vitest'

import Page, { generateMetadata } from './page'
import { ENDPOINTS } from 'apps/back-office/src/mocks/endpoints'
import { server } from 'apps/back-office/src/mocks/node'

vi.mock('./ChangeState', () => ({
  ChangeState: vi.fn(() => <div>ChangeState Component</div>),
}))

describe('generateMetadata', () => {
  it('returns the correct metadata title', async () => {
    const metadata = await generateMetadata()

    expect(metadata).toEqual({ title: 'metadata.title' })
  })
})

describe('Page', () => {
  it('returns an error message when data is not available', async () => {
    server.use(
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID, () =>
        HttpResponse.json({ detail: 'Error message' }, { status: 500 }),
      ),
    )

    const params = Promise.resolve({ meldingId: 123 })
    const result = await Page({ params })

    expect(result).toBe('melding-not-found')
  })

  it('renders the ChangeState component when data is available', async () => {
    const params = Promise.resolve({ meldingId: 123 })

    const result = await Page({ params })

    render(result)

    expect(screen.getByText('ChangeState Component')).toBeInTheDocument()
  })
})
