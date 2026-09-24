import { http, HttpResponse } from 'msw'

import { deleteAttachmentAction } from './actions'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'

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
