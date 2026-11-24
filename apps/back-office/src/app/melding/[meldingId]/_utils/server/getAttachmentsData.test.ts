import { http, HttpResponse } from 'msw'

import { getAttachmentsData } from './getAttachmentsData'
import { attachmentImage } from '~/mocks/data'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'

const mockMeldingId = 88

describe('getAttachmentsData', () => {
  it.each(['thumbnail', 'optimized'] as const)('requests the available %s variant for images', async (type) => {
    server.use(
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ATTACHMENTS, () => HttpResponse.json([attachmentImage])),
      http.get(ENDPOINTS.GET_ATTACHMENT_BY_ID, ({ request }) => {
        expect(new URL(request.url).searchParams.get('type')).toBe(type)

        return HttpResponse.json(new Blob(['mock content'], { type: 'image/jpeg' }), {
          headers: { 'content-type': 'image/jpeg' },
        })
      }),
    )

    const result = await getAttachmentsData(mockMeldingId, type)

    expect(result).toMatchObject([
      {
        blob: expect.any(Blob),
        id: 42,
        originalFilename: 'IMG_0815.jpg',
      },
    ])
  })

  it.each([
    { optimized: attachmentImage.optimized, thumbnail: null, type: 'thumbnail' },
    { optimized: null, thumbnail: attachmentImage.thumbnail, type: 'optimized' },
  ] as const)('requests original when the $type variant is unavailable', async ({ optimized, thumbnail, type }) => {
    server.use(
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ATTACHMENTS, () =>
        HttpResponse.json([{ ...attachmentImage, optimized, thumbnail }]),
      ),
      http.get(ENDPOINTS.GET_ATTACHMENT_BY_ID, ({ request }) => {
        expect(new URL(request.url).searchParams.get('type')).toBe('original')

        return HttpResponse.json(new Blob(['mock content'], { type: 'image/jpeg' }), {
          headers: { 'content-type': 'image/jpeg' },
        })
      }),
    )

    await getAttachmentsData(mockMeldingId, type)
  })

  it('requests the original for non-image attachments regardless of filename extension', async () => {
    server.use(
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ATTACHMENTS, () =>
        HttpResponse.json([
          {
            ...attachmentImage,
            is_image: false,
            optimized: null,
            original_filename: 'attachment.jpg',
            thumbnail: null,
          },
        ]),
      ),
      http.get(ENDPOINTS.GET_ATTACHMENT_BY_ID, ({ request }) => {
        expect(new URL(request.url).searchParams.get('type')).toBe('original')

        return HttpResponse.json(new Blob(['mock content'], { type: 'application/octet-stream' }))
      }),
    )

    await getAttachmentsData(mockMeldingId, 'thumbnail')
  })

  it('throws an error when getAttachmentById returns an error', async () => {
    server.use(
      http.get(ENDPOINTS.GET_ATTACHMENT_BY_ID, () => HttpResponse.json({ detail: 'Error message' }, { status: 500 })),
    )

    await expect(getAttachmentsData(mockMeldingId, 'thumbnail')).rejects.toThrow(
      'Failed to fetch melding attachment file.',
    )
  })

  it('throws an error when getMeldingByMeldingIdAttachments returns an error', async () => {
    server.use(
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ATTACHMENTS, () =>
        HttpResponse.json({ detail: 'Error message' }, { status: 500 }),
      ),
    )

    await expect(getAttachmentsData(mockMeldingId, 'thumbnail')).rejects.toThrow('Failed to fetch melding attachments.')
  })
})
