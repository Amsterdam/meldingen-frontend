import { render } from '@testing-library/react'
import { http, HttpResponse } from 'msw'

import { NotesOverview } from './NotesOverview'
import Page, { generateMetadata } from './page'
import { melding } from '~/mocks/data'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'

vi.mock('./NotesOverview', () => ({
  NotesOverview: vi.fn(() => <div>NotesOverview Component</div>),
}))

vi.mock('next-intl/server', async () => ({
  getTranslations: () =>
    vi.fn().mockImplementation((key, params) => (params ? `${key}: ${JSON.stringify(params)}` : key)),
}))

describe('generateMetadata', () => {
  it('returns the correct metadata title', async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ meldingId: 123 }) })

    expect(metadata).toEqual({ title: 'metadata.title: {"publicId":"ABC"}' })
  })

  it('returns a fallback title when public id is not available', async () => {
    server.use(http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID, () => HttpResponse.json({ data: { public_id: null } })))

    const metadata = await generateMetadata({ params: Promise.resolve({ meldingId: 123 }) })

    expect(metadata).toEqual({ title: 'metadata.title: {"publicId":""}' })
  })
})

describe('Page', () => {
  it('throws an error when getMeldingByMeldingId returns an error or no data', async () => {
    server.use(http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID, () => HttpResponse.json({}, { status: 500 })))

    const params = Promise.resolve({ meldingId: 123 })

    await expect(Page({ params })).rejects.toThrow('Failed to fetch melding data.')
  })

  it('throws an error when getMeldingByMeldingIdNote returns an error', async () => {
    server.use(http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_NOTE, () => HttpResponse.json({}, { status: 500 })))

    const params = Promise.resolve({ meldingId: 123 })

    await expect(Page({ params })).rejects.toThrow('Failed to fetch notes data.')
  })

  it('calls the NotesOverview component with the correct data', async () => {
    const params = Promise.resolve({ meldingId: 123 })
    const result = await Page({ params })

    render(result)

    expect(NotesOverview).toHaveBeenCalledWith(
      { currentUserId: 1, meldingId: 123, notes: [], publicId: melding.public_id },
      undefined,
    )
  })
})
