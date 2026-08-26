import { render } from '@testing-library/react'
import { http, HttpResponse } from 'msw'

import Page, { generateMetadata } from './page'
import { Photos } from './Photos'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'

vi.mock('./Photos', () => ({
  Photos: vi.fn(() => <div>Photos Component</div>),
}))

describe('generateMetadata', () => {
  it('returns the correct metadata title', async () => {
    const metadata = await generateMetadata()

    expect(metadata).toEqual({ title: 'metadata.title' })
  })
})

describe('Page', () => {
  it('throws an error when getMeldingByMeldingIdAttachments returns an error', async () => {
    server.use(http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ATTACHMENTS, () => HttpResponse.json({}, { status: 500 })))

    const params = Promise.resolve({ meldingId: 123 })
    const searchParams = Promise.resolve({})

    await expect(Page({ params, searchParams })).rejects.toThrow('Failed to fetch melding attachments.')
  })

  it('throws an error when getAttachmentById returns an error', async () => {
    server.use(http.get(ENDPOINTS.GET_ATTACHMENT_BY_ID, () => HttpResponse.json({}, { status: 500 })))

    const params = Promise.resolve({ meldingId: 123 })
    const searchParams = Promise.resolve({})

    await expect(Page({ params, searchParams })).rejects.toThrow('Failed to download image.')
  })

  it('calls Photos with the mapped images and no defaultSlideIndex when there is no id search param', async () => {
    const params = Promise.resolve({ meldingId: 123 })
    const searchParams = Promise.resolve({})

    const result = await Page({ params, searchParams })

    render(result)

    expect(Photos).toHaveBeenCalledWith(
      {
        defaultSlideIndex: undefined,
        images: [
          {
            createdAt: undefined,
            data: expect.any(Blob),
            filename: 'IMG_0815.jpg',
            id: 42,
          },
        ],
        meldingId: 123,
      },
      undefined,
    )
  })

  it('calls Photos with the matching defaultSlideIndex when the id search param matches an attachment', async () => {
    const params = Promise.resolve({ meldingId: 123 })
    const searchParams = Promise.resolve({ id: '42' })

    const result = await Page({ params, searchParams })

    render(result)

    expect(Photos).toHaveBeenCalledWith(expect.objectContaining({ defaultSlideIndex: 0 }), undefined)
  })

  it('calls Photos without a defaultSlideIndex when the id search param does not match an attachment', async () => {
    const params = Promise.resolve({ meldingId: 123 })
    const searchParams = Promise.resolve({ id: '999' })

    const result = await Page({ params, searchParams })

    render(result)

    expect(Photos).toHaveBeenCalledWith(expect.objectContaining({ defaultSlideIndex: undefined }), undefined)
  })

  it('excludes PDFs from the attachments passed to Photos', async () => {
    server.use(
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ATTACHMENTS, () =>
        HttpResponse.json([
          { id: 42, original_filename: 'IMG_0815.jpg' },
          { id: 43, original_filename: 'document.pdf' },
        ]),
      ),
    )

    const params = Promise.resolve({ meldingId: 123 })
    const searchParams = Promise.resolve({})

    const result = await Page({ params, searchParams })

    render(result)

    expect(Photos).toHaveBeenCalledWith(
      expect.objectContaining({
        images: [expect.objectContaining({ filename: 'IMG_0815.jpg', id: 42 })],
      }),
      undefined,
    )
  })
})
