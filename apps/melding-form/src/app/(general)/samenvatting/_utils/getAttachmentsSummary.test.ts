import { http, HttpResponse } from 'msw'

import { getAttachmentsSummary } from './getAttachmentsSummary'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'

const mockMeldingId = '88'
const mockToken = 'test-token'

describe('getAttachmentsSummary', () => {
  it('returns correct attachment summary', async () => {
    const result = await getAttachmentsSummary("Foto's", mockMeldingId, mockToken)

    expect(result).toMatchObject({
      files: [
        {
          blob: expect.any(Blob),
          fileName: 'IMG_0815.jpg',
        },
      ],
      key: 'attachments',
      term: "Foto's",
    })
  })

  it('returns an error message when getMeldingByMeldingIdAttachmentsMelder returns an error', async () => {
    server.use(
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ATTACHMENTS_MELDER, () =>
        HttpResponse.json({ detail: 'Error message' }, { status: 500 }),
      ),
    )

    const testFunction = async () => await getAttachmentsSummary("Foto's", mockMeldingId, mockToken)

    await expect(testFunction).rejects.toThrowError('Failed to fetch attachments data.')
  })

  it('returns an error message when getMeldingByMeldingIdAttachmentByAttachmentIdDownload returns an error', async () => {
    server.use(
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ATTACHMENT_BY_ATTACHMENT_ID_DOWNLOAD, () =>
        HttpResponse.json({ detail: 'Error message' }, { status: 500 }),
      ),
    )

    const testFunction = async () => await getAttachmentsSummary("Foto's", mockMeldingId, mockToken)

    await expect(testFunction).rejects.toThrowError('Failed to fetch attachment download.')
  })
})
