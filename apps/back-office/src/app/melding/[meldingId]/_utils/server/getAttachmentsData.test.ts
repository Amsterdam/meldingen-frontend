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

    expect(result).toMatchObject([
      {
        blob: expect.any(Blob),
        id: 42,
        originalFilename: 'IMG_0815.jpg',
      },
    ])
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

    expect(result[0]?.blob).toBeInstanceOf(Blob)
    expect((result[0]?.blob as Blob).type).toBe('application/pdf')

    expect(result).toMatchObject([
      {
        blob: expect.any(Blob),
        id: 1,
        originalFilename: 'PDF_0815.pdf',
      },
    ])
  })

  it.each([404, 500])('throws an error when downloading an attachment returns %s', async (status) => {
    server.use(
      http.get(ENDPOINTS.GET_ATTACHMENT_BY_ID, () => HttpResponse.json({ detail: 'Error message' }, { status })),
    )

    await expect(getAttachmentsData(mockMeldingId, imageAttachmentType)).rejects.toThrow(
      'Failed to fetch melding attachment file.',
    )
  })

  it('shows not found when the melding does not exist', async () => {
    server.use(http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ATTACHMENTS, () => HttpResponse.json({}, { status: 404 })))

    await expect(getAttachmentsData(mockMeldingId, imageAttachmentType)).rejects.toThrow('NEXT_HTTP_ERROR_FALLBACK;404')
  })

  it('returns an empty list when the melding has no attachments', async () => {
    server.use(http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ATTACHMENTS, () => HttpResponse.json([])))

    await expect(getAttachmentsData(mockMeldingId, imageAttachmentType)).resolves.toEqual([])
  })

  it.each([403, 500])('throws an error when fetching melding attachments returns %s', async (status) => {
    server.use(
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ATTACHMENTS, () =>
        HttpResponse.json({ detail: 'Error message' }, { status }),
      ),
    )

    await expect(getAttachmentsData(mockMeldingId, imageAttachmentType)).rejects.toThrow(
      'Failed to fetch melding attachments.',
    )
  })
})
