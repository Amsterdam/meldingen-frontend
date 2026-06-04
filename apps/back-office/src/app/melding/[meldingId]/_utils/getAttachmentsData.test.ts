import { http, HttpResponse } from 'msw'

import { getAttachmentsData } from './getAttachmentsData'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'

const mockMeldingId = 88

describe('getAttachmentsData', () => {
  it('returns correct attachments data', async () => {
    const result = await getAttachmentsData(mockMeldingId, (key: string) => key)

    expect(result).toMatchObject({
      files: [
        {
          blob: expect.any(Blob),
          fileName: 'IMG_0815.jpg',
        },
      ],
      key: 'attachments',
      term: 'detail.attachments.title',
    })
  })

  it('returns an error message when getMeldingByMeldingIdAttachments returns an error', async () => {
    server.use(
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ATTACHMENTS, () =>
        HttpResponse.json({ detail: 'Error message' }, { status: 500 }),
      ),
    )

    const result = await getAttachmentsData(mockMeldingId, (key: string) => key)

    expect(result).toEqual({ error: 'Error message' })
  })

  it('returns an attachment with error message when getAttachmentById returns an error ', async () => {
    server.use(
      http.get(ENDPOINTS.GET_ATTACHMENT_BY_ID, () => HttpResponse.json({ detail: 'Error message' }, { status: 500 })),
    )

    const result = await getAttachmentsData(mockMeldingId, (key: string) => key)

    expect(result).toMatchObject({
      files: [
        {
          blob: null,
          error: 'Error message',
          fileName: 'IMG_0815.jpg',
        },
      ],
      key: 'attachments',
      term: 'detail.attachments.title',
    })
  })
})
