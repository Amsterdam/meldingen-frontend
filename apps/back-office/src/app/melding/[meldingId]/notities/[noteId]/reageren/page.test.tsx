import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { redirect } from 'next/navigation'
import { vi } from 'vitest'

import Page, { generateMetadata } from './page'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'

vi.mock('./ReactNote', () => ({
  ReactNote: vi.fn(() => <div>ReactNote Component</div>),
}))

const params = Promise.resolve({ meldingId: '123', noteId: '456' })

const mockNote = (note: { text: string; userId: number }) =>
  server.use(
    http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_NOTE_BY_NOTE_ID, () =>
      HttpResponse.json({
        created_at: '2025-05-26T11:56:34.081Z',
        id: 456,
        text: note.text,
        user: { email: 'someone@example.com', id: note.userId },
      }),
    ),
  )

describe('Page', () => {
  it('generates the document title metadata', async () => {
    expect(await generateMetadata()).toEqual({ title: 'metadata.title' })
  })

  it('renders the ReactNote component for a note of another user', async () => {
    const result = await Page({ params })

    render(result)

    expect(screen.getByText('ReactNote Component')).toBeInTheDocument()
    expect(redirect).not.toHaveBeenCalledWith('/melding/123/notities/456/wijzigen')
    expect(redirect).not.toHaveBeenCalledWith('/melding/123/notities')
  })

  it('redirects to the edit page when the note belongs to the current user', async () => {
    mockNote({ text: 'My own note.', userId: 1 })

    await Page({ params })

    expect(redirect).toHaveBeenCalledWith('/melding/123/notities/456/wijzigen')
  })

  it('redirects to the notes overview when the note is deleted', async () => {
    mockNote({ text: '', userId: 2 })

    await Page({ params })

    expect(redirect).toHaveBeenCalledWith('/melding/123/notities')
  })

  it('throws an error when fetching the note fails', async () => {
    server.use(
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_NOTE_BY_NOTE_ID, () =>
        HttpResponse.json({ detail: 'Error message' }, { status: 500 }),
      ),
    )

    await expect(Page({ params })).rejects.toThrow('Failed to fetch note.')
  })

  it('throws an error when fetching the current user fails', async () => {
    server.use(http.get(ENDPOINTS.GET_USER_ME, () => HttpResponse.json({ detail: 'Error message' }, { status: 500 })))

    await expect(Page({ params })).rejects.toThrow('Failed to fetch current user data.')
  })
})
