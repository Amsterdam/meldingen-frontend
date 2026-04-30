import { render, screen } from '@testing-library/react'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'
import { http, HttpResponse } from 'msw'
import { vi } from 'vitest'

import Page from './page'

vi.mock('./ChangeUrgency', () => ({
  ChangeUrgency: vi.fn(() => <div>ChangeUrgency Component</div>),
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

  it('renders the ChangeUrgency component when data is available', async () => {
    const params = Promise.resolve({ meldingId: 123 })

    const result = await Page({ params })

    render(result)

    expect(screen.getByText('ChangeUrgency Component')).toBeInTheDocument()
  })
})
