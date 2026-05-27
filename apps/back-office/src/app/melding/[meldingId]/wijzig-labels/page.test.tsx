import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { vi } from 'vitest'

import { ChangeLabels } from './ChangeLabels'
import Page from './page'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'

vi.mock('./ChangeLabels', () => ({
  ChangeLabels: vi.fn(() => <div>ChangeLabels Component</div>),
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

  it('throws an error when labels data is not available', async () => {
    server.use(http.get(ENDPOINTS.GET_LABEL, () => HttpResponse.json({ detail: 'Error message' }, { status: 500 })))

    const params = Promise.resolve({ meldingId: 123 })

    await expect(Page({ params })).rejects.toThrowError('Failed to fetch labels.')
  })

  it('renders the ChangeLabels component when data is available', async () => {
    const params = Promise.resolve({ meldingId: 123 })

    const result = await Page({ params })

    render(result)

    expect(screen.getByText('ChangeLabels Component')).toBeInTheDocument()
  })

  it('passes undefined as currentLabelIds to ChangeLabels when melding has no labels', async () => {
    server.use(
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID, () =>
        HttpResponse.json({
          id: 123,
          labels: undefined,
          public_id: 'MEL-123',
        }),
      ),
    )

    const params = Promise.resolve({ meldingId: 123 })

    const result = await Page({ params })

    render(result)

    expect(ChangeLabels).toHaveBeenCalledWith(
      expect.objectContaining({
        currentLabelIds: undefined,
      }),
      undefined,
    )
  })
})
