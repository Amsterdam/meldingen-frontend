import { http, HttpResponse } from 'msw'
import { redirect } from 'next/navigation'

import { postReactNoteForm } from './actions'
import { MAX_NOTE_LENGTH } from '~/constants'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'

const defaultArgs = { meldingId: 123, parentNoteId: 456 }

// RichTextEditor submits the ProseMirror doc as JSON, so tests build that same shape here
// instead of appending plain markdown/text.
const noteDoc = (text: string) =>
  JSON.stringify({
    content: [{ content: text ? [{ text, type: 'text' }] : [], type: 'paragraph' }],
    type: 'doc',
  })

describe('postReactNoteForm', () => {
  it('returns a validation error when reactNote is empty', async () => {
    const formData = new FormData()

    formData.append('reactNote', noteDoc(''))

    const result = await postReactNoteForm(defaultArgs, null, formData)

    expect(result).toEqual({
      formData,
      validationErrors: [{ key: 'reactNote', message: 'errors.required' }],
    })
    expect(redirect).not.toHaveBeenCalled()
  })

  it('returns a validation error when reactNote exceeds the maximum length', async () => {
    const formData = new FormData()

    formData.append('reactNote', noteDoc('a'.repeat(MAX_NOTE_LENGTH + 1)))

    const result = await postReactNoteForm(defaultArgs, null, formData)

    expect(result).toEqual({
      formData,
      validationErrors: [{ key: 'reactNote', message: 'errors.maxLength' }],
    })
    expect(redirect).not.toHaveBeenCalled()
  })

  it('returns an API error when the API returns an error', async () => {
    server.use(
      http.post(ENDPOINTS.POST_MELDING_BY_MELDING_ID_NOTE, () =>
        HttpResponse.json({ detail: 'Error message' }, { status: 500 }),
      ),
    )

    const formData = new FormData()

    formData.append('reactNote', noteDoc('Some reply text'))

    const result = await postReactNoteForm(defaultArgs, null, formData)

    expect(result).toEqual({
      apiError: { detail: 'Error message' },
      formData,
    })
    expect(redirect).not.toHaveBeenCalledWith('/melding/123/notities')
  })

  it('posts a new note with the parent note id and redirects on success', async () => {
    let requestBody: unknown

    server.use(
      http.post(ENDPOINTS.POST_MELDING_BY_MELDING_ID_NOTE, async ({ request }) => {
        requestBody = await request.json()

        return new HttpResponse()
      }),
    )

    const formData = new FormData()

    formData.append('reactNote', noteDoc('Some reply text'))

    await postReactNoteForm(defaultArgs, null, formData)

    expect(requestBody).toEqual({ parent_note_id: 456, text: 'Some reply text' })
    expect(redirect).toHaveBeenCalledWith('/melding/123/notities')
  })
})
