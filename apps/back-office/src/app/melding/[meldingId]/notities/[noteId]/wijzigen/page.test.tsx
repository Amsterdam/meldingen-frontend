import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { vi } from 'vitest'

import Page, { generateMetadata } from './page'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'

vi.mock('./UpdateNote', () => ({
  UpdateNote: vi.fn(() => <div>UpdateNote Component</div>),
}))

describe('generateMetadata', () => {
  it('returns the correct metadata title', async () => {
    const metadata = await generateMetadata()

    expect(metadata).toEqual({ title: 'metadata.title' })
  })
})

describe('Page', () => {
  it('renders', async () => {
    const params = Promise.resolve({ meldingId: 123, noteId: 456 })

    const result = await Page({ params })

    render(result)

    expect(screen.getByText('UpdateNote Component')).toBeInTheDocument()
  })

  it('throws an error when fetching note fails', async () => {
    server.use(
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_NOTE_BY_NOTE_ID, () =>
        HttpResponse.json({ detail: 'Error message' }, { status: 500 }),
      ),
    )

    const params = Promise.resolve({ meldingId: 123, noteId: 456 })

    await expect(Page({ params })).rejects.toThrow('Failed to fetch note.')
  })
})
