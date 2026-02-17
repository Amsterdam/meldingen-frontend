import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { vi } from 'vitest'

import Page from './page'
import { ENDPOINTS } from 'apps/back-office/src/mocks/endpoints'
import { server } from 'apps/back-office/src/mocks/node'

vi.mock('./ChangeState', () => ({
  ChangeState: vi.fn(() => <div>ChangeState Component</div>),
}))

describe('Page', () => {
  it('throws an error when melding data is not available', async () => {
    server.use(
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID, () =>
        HttpResponse.json({ detail: 'Error message' }, { status: 500 }),
      ),
    )

    const params = Promise.resolve({ meldingId: 123 })

    await expect(Page({ params })).rejects.toThrowError('Failed to fetch melding data.')
  })

  it('throws an error when next possible states data is not available', async () => {
    server.use(
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_NEXT_POSSIBLE_STATES, () =>
        HttpResponse.json({ detail: 'Error message' }, { status: 500 }),
      ),
    )

    const params = Promise.resolve({ meldingId: 123 })

    await expect(Page({ params })).rejects.toThrowError('Failed to fetch next possible states.')
  })

  it('renders the ChangeState component when data is available', async () => {
    const params = Promise.resolve({ meldingId: 123 })

    const result = await Page({ params })

    render(result)

    expect(screen.getByText('ChangeState Component')).toBeInTheDocument()
  })
})
