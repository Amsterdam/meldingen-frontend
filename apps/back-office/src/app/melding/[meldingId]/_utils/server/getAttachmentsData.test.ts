import { http, HttpResponse } from 'msw'

import { getAttachmentsData } from './getAttachmentsData'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'

const mockMeldingId = 88
const imageAttachmentType = 'thumbnail'

describe('getAttachmentsData', () => {
  it('returns correct attachments data for Images', async () => {
    server.use(
      http.get(ENDPOINTS.GET_ATTACHMENT_BY_ID, ({ request }) => {
        expect(new URL(request.url).searchParams.get('type')).toBe(imageAttachmentType)

        return HttpResponse.json(new Blob(['mock content'], { type: 'image/jpeg' }), {
          headers: { 'content-type': 'image/jpeg' },
        })
      }),
    )

    const result = await getAttachmentsData(mockMeldingId, imageAttachmentType)

    expect(result).toMatchObject({
      attachmentsWithFile: [
        {
          blob: expect.any(Blob),
          id: 42,
          originalFilename: 'IMG_0815.jpg',
        },
      ],
    })
  })

  it('returns correct attachments data for PDFs', async () => {
    server.use(
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ATTACHMENTS, () =>
        HttpResponse.json([{ id: 1, original_filename: 'PDF_0815.pdf' }]),
      ),
    )

    server.use(
      http.get(ENDPOINTS.GET_ATTACHMENT_BY_ID, ({ request }) => {
        expect(new URL(request.url).searchParams.get('type')).toBe('original')
        return HttpResponse.json(new Blob(['mock content'], { type: 'application/pdf' }), {
          headers: { 'content-type': 'application/pdf' },
        })
      }),
    )

    const result = await getAttachmentsData(mockMeldingId, imageAttachmentType)

    expect(result.attachmentsWithFile?.[0]?.blob).toBeInstanceOf(Blob)
    expect((result.attachmentsWithFile?.[0]?.blob as Blob).type).toBe('application/pdf')

    expect(result).toMatchObject({
      attachmentsWithFile: [
        {
          blob: expect.any(Blob),
          id: 1,
          originalFilename: 'PDF_0815.pdf',
        },
      ],
    })
  })

  it('rejects when getMeldingByMeldingIdAttachments returns an error', async () => {
    server.use(
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ATTACHMENTS, () =>
        HttpResponse.json({ detail: 'Error message' }, { status: 500 }),
      ),
    )

    const result = await getAttachmentsData(mockMeldingId)
    expect(result.error).toBe('Error message')
  })
})
