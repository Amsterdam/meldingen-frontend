import { http, HttpResponse } from 'msw'

import type { AttachmentOutput } from '@meldingen/api-client'

import { getAttachmentsData } from './getAttachmentsData'
import { attachmentImage } from '~/mocks/data'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'

const mockMeldingId = 88

/** Mocks a melding with a single attachment and records the `type` query of every download request. */
const mockAttachmentDownload = (attachment: AttachmentOutput) => {
  const requestedTypes: (string | null)[] = []

  server.use(
    http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ATTACHMENTS, () => HttpResponse.json([attachment])),
    http.get(ENDPOINTS.GET_ATTACHMENT_BY_ID, ({ request }) => {
      requestedTypes.push(new URL(request.url).searchParams.get('type'))

      return new HttpResponse('mock content', {
        headers: { 'content-type': 'application/octet-stream' },
      })
    }),
  )

  return requestedTypes
}

describe('getAttachmentsData', () => {
  it.each(['thumbnail', 'optimized'] as const)('requests the available %s variant for images', async (type) => {
    const requestedTypes = mockAttachmentDownload(attachmentImage)

    const result = await getAttachmentsData(mockMeldingId, type)

    expect(requestedTypes).toEqual([type])

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
    const requestedTypes = mockAttachmentDownload({ ...attachmentImage, optimized, thumbnail })

    await getAttachmentsData(mockMeldingId, type)

    expect(requestedTypes).toEqual(['original'])
  })

  it('requests the original for non-image attachments regardless of filename extension', async () => {
    const requestedTypes = mockAttachmentDownload({
      ...attachmentImage,
      is_image: false,
      optimized: null,
      original_filename: 'attachment.jpg',
      thumbnail: null,
    })

    await getAttachmentsData(mockMeldingId, 'thumbnail')

    expect(requestedTypes).toEqual(['original'])
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

    await expect(getAttachmentsData(mockMeldingId, 'thumbnail')).rejects.toThrow('NEXT_HTTP_ERROR_FALLBACK;404')
  })

  it('returns an empty list when the melding has no attachments', async () => {
    server.use(http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ATTACHMENTS, () => HttpResponse.json([])))

    await expect(getAttachmentsData(mockMeldingId, 'thumbnail')).resolves.toEqual([])
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
