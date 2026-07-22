import { http, HttpResponse } from 'msw'
import { redirect } from 'next/navigation'

import { postUpdateNoteForm } from './actions'
import { MAX_NOTE_LENGTH } from '~/constants'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'

const defaultArgs = { meldingId: 123, noteId: 456 }

// RichTextEditor submits the ProseMirror doc as JSON, so tests build that same shape here
// instead of appending plain markdown/text.
const noteDoc = (text: string) =>
  JSON.stringify({
    content: [{ content: text ? [{ text, type: 'text' }] : [], type: 'paragraph' }],
    type: 'doc',
  })

describe('postUpdateNoteForm', () => {
  it('returns a validation error when updateNote exceeds the maximum length', async () => {
    const formData = new FormData()
    formData.append('updateNote', noteDoc('a'.repeat(MAX_NOTE_LENGTH + 1)))

    const result = await postUpdateNoteForm(defaultArgs, null, formData)

    expect(result).toEqual({
      formData,
      validationErrors: [{ key: 'updateNote', message: 'errors.maxLength' }],
    })
    expect(redirect).not.toHaveBeenCalled()
  })

  it('returns an API error when the API returns an error', async () => {
    server.use(
      http.patch(ENDPOINTS.PATCH_MELDING_BY_MELDING_ID_NOTE_BY_NOTE_ID, () =>
        HttpResponse.json({ detail: 'Error message' }, { status: 500 }),
      ),
    )

    const formData = new FormData()
    formData.append('updateNote', noteDoc('Some note text'))

    const result = await postUpdateNoteForm(defaultArgs, null, formData)

    expect(result).toEqual({
      apiError: { detail: 'Error message' },
      formData,
    })
    expect(redirect).not.toHaveBeenCalledWith('/melding/123')
  })

  it('redirects on success', async () => {
    const formData = new FormData()
    formData.append('updateNote', noteDoc('Some note text'))

    await postUpdateNoteForm(defaultArgs, null, formData)

    expect(redirect).toHaveBeenCalledWith('/melding/123/notities')
  })

  it('accepts a note at exactly the maximum length', async () => {
    const formData = new FormData()
    formData.append('updateNote', noteDoc('a'.repeat(MAX_NOTE_LENGTH)))

    await postUpdateNoteForm(defaultArgs, null, formData)

    expect(redirect).toHaveBeenCalledWith('/melding/123/notities')
  })

  it('posts an empty string when the editor only contains whitespace, even when it has markup', async () => {
    let requestBody: { text?: string } | undefined

    server.use(
      http.patch(ENDPOINTS.PATCH_MELDING_BY_MELDING_ID_NOTE_BY_NOTE_ID, async ({ request }) => {
        requestBody = (await request.json()) as { text?: string }
        return HttpResponse.json({}, { status: 200 })
      }),
    )

    const markedUpWhitespace = JSON.stringify({
      content: [
        {
          content: [
            { marks: [{ type: 'bold' }, { type: 'italic' }, { type: 'underline' }], text: '   ', type: 'text' },
          ],
          type: 'paragraph',
        },
      ],
      type: 'doc',
    })

    const formData = new FormData()
    formData.append('updateNote', markedUpWhitespace)

    await postUpdateNoteForm(defaultArgs, null, formData)

    expect(requestBody).toEqual({ text: '' })
    expect(redirect).toHaveBeenCalledWith('/melding/123/notities')
  })
})
