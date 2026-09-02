import { http, HttpResponse } from 'msw'

import { deleteAttachmentAction, uploadAttachmentAction } from './actions'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'

describe('uploadAttachmentAction', () => {
  const file = new File(['file content'], 'IMG_0815.jpg', { type: 'image/jpeg' })

  it('returns the server id on success', async () => {
    const result = await uploadAttachmentAction(123, file)

    expect(result).toEqual({ error: undefined, serverId: 42 })
  })

  it('returns an error message when the API returns a simple error', async () => {
    server.use(
      http.post(ENDPOINTS.POST_MELDING_BY_MELDING_ID_ATTACHMENT, () =>
        HttpResponse.json({ detail: 'Error message' }, { status: 500 }),
      ),
    )

    const result = await uploadAttachmentAction(123, file)

    expect(result).toEqual({ error: 'Error message', serverId: undefined })
  })

  it('returns an error message when the API returns a validation error array', async () => {
    server.use(
      http.post(ENDPOINTS.POST_MELDING_BY_MELDING_ID_ATTACHMENT, () =>
        HttpResponse.json(
          { detail: [{ loc: ['body', 'file'], msg: 'Invalid file', type: 'value_error' }] },
          { status: 422 },
        ),
      ),
    )

    const result = await uploadAttachmentAction(123, file)

    expect(result).toEqual({ error: 'Invalid file', serverId: undefined })
  })
})

describe('deleteAttachmentAction', () => {
  it('returns an error when the delete call fails', async () => {
    server.use(
      http.delete(ENDPOINTS.DELETE_ATTACHMENT_BY_ID, () => HttpResponse.json({ detail: 'Not Found' }, { status: 404 })),
    )

    const result = await deleteAttachmentAction(123)

    expect(result.status).toBe(404)
    expect(result.error).toBe('Not Found')
  })

  //
  it('returns undefined error when the delete call succeeds', async () => {
    server.use(http.delete(ENDPOINTS.DELETE_ATTACHMENT_BY_ID, () => new HttpResponse(undefined, { status: 204 })))

    const result = await deleteAttachmentAction(123)

    expect(result.status).toBe(204)
  })
})
