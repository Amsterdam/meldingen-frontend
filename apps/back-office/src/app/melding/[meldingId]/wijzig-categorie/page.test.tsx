import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { redirect } from 'next/navigation'
import { vi } from 'vitest'

import Page, { generateMetadata } from './page'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'

vi.mock('./ChangeCategory', () => ({
  ChangeCategory: vi.fn(() => <div>ChangeCategory Component</div>),
}))

describe('Page', () => {
  it('generates the document title metadata', async () => {
    expect(await generateMetadata()).toEqual({ title: 'metadata.title' })
  })

  it('shows not found when the melding does not exist', async () => {
    server.use(http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID, () => HttpResponse.json({}, { status: 404 })))

    await expect(Page({ params: Promise.resolve({ meldingId: '123' }) })).rejects.toThrow(
      'NEXT_HTTP_ERROR_FALLBACK;404',
    )
  })

  it.each([403, 500])('throws an error when fetching the melding returns %s', async (status) => {
    server.use(
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID, () => HttpResponse.json({ detail: 'Error message' }, { status })),
    )

    const params = Promise.resolve({ meldingId: '123' })

    await expect(Page({ params })).rejects.toThrow('Failed to fetch melding data.')
  })

  it.each([404, 500])('throws an error when fetching classifications returns %s', async (status) => {
    server.use(http.get(ENDPOINTS.GET_CLASSIFICATION, () => HttpResponse.json({ detail: 'Error message' }, { status })))

    const params = Promise.resolve({ meldingId: '123' })

    await expect(Page({ params })).rejects.toThrow('Failed to fetch classifications.')
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
