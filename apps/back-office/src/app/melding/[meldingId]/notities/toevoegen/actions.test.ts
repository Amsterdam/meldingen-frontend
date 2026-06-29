import { http, HttpResponse } from 'msw'
import { redirect } from 'next/navigation'

import { postAddNoteForm } from './actions'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'

const defaultArgs = { meldingId: 123 }

describe('postAddNoteForm', () => {
  it('returns a validation error when the note is empty', async () => {
    const formData = new FormData()
    formData.append('text', '')

    const result = await postAddNoteForm(defaultArgs, null, formData)

    expect(result).toEqual({
      textFromAction: '',
      validationErrors: [{ key: 'text', message: 'errors.validation.required' }],
    })
    expect(redirect).not.toHaveBeenCalledWith('/melding/123')
  })

  it('returns a validation error when the API responds with 422', async () => {
    server.use(
      http.post(ENDPOINTS.POST_MELDING_BY_MELDING_ID_NOTE, () =>
        HttpResponse.json(
          {
            detail: [{ loc: ['body', 'text'], msg: 'Validation error', type: 'value_error' }],
          },
          { status: 422 },
        ),
      ),
    )

    const formData = new FormData()
    formData.append('text', 'Hello world')

    const result = await postAddNoteForm(defaultArgs, null, formData)

    expect(result).toEqual({
      textFromAction: 'Hello world',
      validationErrors: [{ key: 'text', message: 'Validation error' }],
    })
    expect(redirect).not.toHaveBeenCalledWith('/melding/123')
  })

  it('returns a system error when the API responds with an error', async () => {
    server.use(
      http.post(ENDPOINTS.POST_MELDING_BY_MELDING_ID_NOTE, () =>
        HttpResponse.json({ detail: 'Error message' }, { status: 500 }),
      ),
    )

    const formData = new FormData()
    formData.append('text', 'Hello world')

    const result = await postAddNoteForm(defaultArgs, null, formData)

    expect(result).toEqual({
      systemError: 'Error message',
      textFromAction: 'Hello world',
    })
    expect(redirect).not.toHaveBeenCalledWith('/melding/123')
  })

  it('redirects on success', async () => {
    const formData = new FormData()
    formData.append('text', 'Hello world')

    await postAddNoteForm(defaultArgs, null, formData)

    expect(redirect).toHaveBeenCalledWith('/melding/123')
  })
})
