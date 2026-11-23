import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { vi } from 'vitest'

import Page, { generateMetadata } from './page'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'

vi.mock('./UpdateNote', () => ({
  UpdateNote: vi.fn(() => <div>UpdateNote Component</div>),
}))

describe('Page', () => {
  it('generates the document title metadata', async () => {
    expect(await generateMetadata()).toEqual({ title: 'metadata.title' })
  })

  it('renders', async () => {
    const params = Promise.resolve({ meldingId: '123', noteId: '456' })

    const result = await Page({ params })

    render(result)

    expect(screen.getByText('UpdateNote Component')).toBeInTheDocument()
  })

  it('shows not found when the melding or note does not exist', async () => {
    server.use(
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_NOTE_BY_NOTE_ID, () => HttpResponse.json({}, { status: 404 })),
    )

    const params = Promise.resolve({ meldingId: '123', noteId: '456' })

    await expect(Page({ params })).rejects.toThrow('NEXT_HTTP_ERROR_FALLBACK;404')
  })

  it.each([403, 500])('throws an error when fetching the note returns %s', async (status) => {
    server.use(
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_NOTE_BY_NOTE_ID, () =>
        HttpResponse.json({ detail: 'Error message' }, { status }),
      ),
    )

    const params = Promise.resolve({ meldingId: '123', noteId: '456' })

    await expect(Page({ params })).rejects.toThrow('Failed to fetch note.')
  })
})
