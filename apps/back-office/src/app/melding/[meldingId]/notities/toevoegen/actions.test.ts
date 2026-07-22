import { http, HttpResponse } from 'msw'
import { redirect } from 'next/navigation'

import { postAddNoteForm } from './actions'
import { MAX_NOTE_LENGTH } from '~/constants'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'

const defaultArgs = { meldingId: 123 }

// RichTextEditor submits the ProseMirror doc as JSON, so tests build that same shape here
// instead of appending plain markdown/text.
const noteDoc = (text: string) =>
  JSON.stringify({
    content: [{ content: text ? [{ text, type: 'text' }] : [], type: 'paragraph' }],
    type: 'doc',
  })

describe('postAddNoteForm', () => {
  it('returns a validation error when addNote is empty', async () => {
    const formData = new FormData()

    const result = await postAddNoteForm(defaultArgs, null, formData)

    expect(result).toEqual({
      formData,
      validationErrors: [{ key: 'addNote', message: 'errors.required' }],
    })
    expect(redirect).not.toHaveBeenCalled()
  })

  it('returns a validation error when addNote exceeds the maximum length', async () => {
    const formData = new FormData()
    formData.append('addNote', noteDoc('a'.repeat(MAX_NOTE_LENGTH + 1)))

    const result = await postAddNoteForm(defaultArgs, null, formData)

    expect(result).toEqual({
      formData,
      validationErrors: [{ key: 'addNote', message: 'errors.maxLength' }],
    })
    expect(redirect).not.toHaveBeenCalled()
  })

  it('returns a system error when the API returns an error', async () => {
    server.use(
      http.post(ENDPOINTS.POST_MELDING_BY_MELDING_ID_NOTE, () =>
        HttpResponse.json({ detail: 'Error message' }, { status: 500 }),
      ),
    )

    const formData = new FormData()
    formData.append('addNote', noteDoc('Some note text'))

    const result = await postAddNoteForm(defaultArgs, null, formData)

    expect(result).toEqual({
      formData,
      systemError: { detail: 'Error message' },
    })
    expect(redirect).not.toHaveBeenCalledWith('/melding/123')
  })

  it('redirects on success', async () => {
    const formData = new FormData()
    formData.append('addNote', noteDoc('Some note text'))

    await postAddNoteForm(defaultArgs, null, formData)

    expect(redirect).toHaveBeenCalledWith('/melding/123/notities')
  })

  it('accepts a note at exactly the maximum length', async () => {
    const formData = new FormData()
    formData.append('addNote', noteDoc('a'.repeat(MAX_NOTE_LENGTH)))

    await postAddNoteForm(defaultArgs, null, formData)

    expect(redirect).toHaveBeenCalledWith('/melding/123/notities')
  })

  it('treats whitespace-only content as empty, even though its character count is non-zero', async () => {
    const formData = new FormData()
    formData.append('addNote', noteDoc(' '))

    const result = await postAddNoteForm(defaultArgs, null, formData)

    expect(result).toEqual({
      formData,
      validationErrors: [{ key: 'addNote', message: 'errors.required' }],
    })
    expect(redirect).not.toHaveBeenCalled()
  })
})
