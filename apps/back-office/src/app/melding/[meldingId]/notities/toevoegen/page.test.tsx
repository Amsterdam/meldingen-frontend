import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { vi } from 'vitest'

import Page, { generateMetadata } from './page'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'

vi.mock('./AddNote', () => ({
  AddNote: vi.fn(() => <div>AddNote Component</div>),
}))

describe('Page', () => {
  it('generates the document title metadata', async () => {
    expect(await generateMetadata()).toEqual({ title: 'metadata.title' })
  })

  it('renders', async () => {
    const params = Promise.resolve({ meldingId: '123' })

    const result = await Page({ params })

    render(result)

    expect(screen.getByText('AddNote Component')).toBeInTheDocument()
  })

  it('shows not found when the melding does not exist', async () => {
    server.use(http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID, () => HttpResponse.json({}, { status: 404 })))

    await expect(Page({ params: Promise.resolve({ meldingId: '123' }) })).rejects.toThrow(
      'NEXT_HTTP_ERROR_FALLBACK;404',
    )
  })

  it.each([403, 500])('throws an error when fetching the melding returns %s', async (status) => {
    server.use(http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID, () => HttpResponse.json({}, { status })))

    await expect(Page({ params: Promise.resolve({ meldingId: '123' }) })).rejects.toThrow(
      'Failed to fetch melding data.',
    )
  })
})
