import { http, HttpResponse } from 'msw'

import { getAttachmentsData } from './getAttachmentsData'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'

const mockMeldingId = 88

const imageMetadata = {
  created_at: '2025-05-26T11:56:34.081Z',
  id: 42,
  is_image: true,
  optimized: { filename: 'IMG_0815.webp', media_type: 'image/webp' },
  original_filename: 'IMG_0815.jpg',
  original_media_type: 'image/jpeg',
  thumbnail: { filename: 'IMG_0815-thumbnail.webp', media_type: 'image/webp' },
  updated_at: '2025-05-26T11:56:34.081Z',
  user: null,
}

describe('getAttachmentsData', () => {
  it.each(['thumbnail', 'optimized'] as const)('requests the available %s variant for images', async (type) => {
    server.use(http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ATTACHMENTS, () => HttpResponse.json([imageMetadata])))

    server.use(
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
    { optimized: imageMetadata.optimized, thumbnail: null, type: 'thumbnail' },
    { optimized: null, thumbnail: imageMetadata.thumbnail, type: 'optimized' },
  ] as const)('requests original when the $type variant is unavailable', async ({ optimized, thumbnail, type }) => {
    server.use(
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ATTACHMENTS, () =>
        HttpResponse.json([{ ...imageMetadata, optimized, thumbnail }]),
      ),
    )

    server.use(
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
            ...imageMetadata,
            is_image: false,
            optimized: null,
            original_filename: 'attachment.jpg',
            thumbnail: null,
          },
        ]),
      ),
    )

    server.use(
      http.get(ENDPOINTS.GET_ATTACHMENT_BY_ID, ({ request }) => {
        expect(new URL(request.url).searchParams.get('type')).toBe('original')

        return HttpResponse.json(new Blob(['mock content'], { type: 'application/octet-stream' }))
      }),
    )

    await getAttachmentsData(mockMeldingId, 'thumbnail')
  })

  it.each([404, 500])('throws an error when downloading an attachment returns %s', async (status) => {
    server.use(
      http.get(ENDPOINTS.GET_ATTACHMENT_BY_ID, () => HttpResponse.json({ detail: 'Error message' }, { status })),
    )

    await expect(getAttachmentsData(mockMeldingId, 'thumbnail')).rejects.toThrow(
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

    await expect(getAttachmentsData(mockMeldingId, 'thumbnail')).rejects.toThrow('Failed to fetch melding attachments.')
  })
})
