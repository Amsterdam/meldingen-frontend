import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { redirect } from 'next/navigation'
import { vi } from 'vitest'

import Page from './page'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'

vi.mock('./ChangeCategory', () => ({
  ChangeCategory: vi.fn(() => <div>ChangeCategory Component</div>),
}))

describe('Page', () => {
  it('throws an error when melding data is not available', async () => {
    server.use(
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID, () =>
        HttpResponse.json({ detail: 'Error message' }, { status: 500 }),
      ),
    )

    const params = Promise.resolve({ meldingId: '123' })

    await expect(Page({ params })).rejects.toThrowError('Failed to fetch melding data.')
  })

  it('throws an error when classifications are not available', async () => {
    server.use(
      http.get(ENDPOINTS.GET_CLASSIFICATION, () => HttpResponse.json({ detail: 'Error message' }, { status: 500 })),
    )

    const params = Promise.resolve({ meldingId: '123' })

    await expect(Page({ params })).rejects.toThrowError('Failed to fetch classifications.')
  })

  it('redirects when the melding state does not allow reclassification', async () => {
    server.use(
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID, () =>
        HttpResponse.json({
          classification: { id: 2, name: 'Test classification' },
          public_id: 'ABC',
          state: 'completed',
        }),
      ),
    )

    const params = Promise.resolve({ meldingId: '123' })

    await Page({ params })

    expect(redirect).toHaveBeenCalledWith('/melding/123')
  })

  it('renders the ChangeCategory component when data is available', async () => {
    const params = Promise.resolve({ meldingId: '123' })

    const result = await Page({ params })

    render(result)

    expect(screen.getByText('ChangeCategory Component')).toBeInTheDocument()
  })
})
