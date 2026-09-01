import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'

import { getAttachmentsData } from '../_utils/server'
import { AddAttachment } from './AddAttachment'
import Page, { generateMetadata } from './page'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'

vi.mock('./AddAttachment', () => ({
  AddAttachment: vi.fn(() => <div>AddAttachment Component</div>),
}))

vi.mock('../_utils/server', () => ({
  getAttachmentsData: vi.fn(),
}))

vi.mock('next-intl/server', async () => ({
  getTranslations: () =>
    vi.fn().mockImplementation((key, params) => (params ? `${key}: ${JSON.stringify(params)}` : key)),
}))

const attachments = { files: [], key: 'attachments', term: 'detail.attachments.title' }

describe('generateMetadata', () => {
  it('returns the correct metadata title', async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ meldingId: 123 }) })

    expect(metadata).toEqual({ title: 'metadata.title: {"publicId":"ABC"}' })
  })

  it('returns a fallback title when public id is not available', async () => {
    server.use(http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID, () => HttpResponse.json({ data: { public_id: null } })))

    const metadata = await generateMetadata({ params: Promise.resolve({ meldingId: 123 }) })

    expect(metadata).toEqual({ title: 'metadata.title: {"publicId":""}' })
  })
})

describe('Page', () => {
  it('calls getAttachmentsData with the melding id and translation function', async () => {
    vi.mocked(getAttachmentsData).mockResolvedValueOnce(attachments)

    await Page({ params: Promise.resolve({ meldingId: 123 }) })

    expect(getAttachmentsData).toHaveBeenCalledWith(123, expect.any(Function))
  })

  it('renders the error message when getAttachmentsData returns an error', async () => {
    vi.mocked(getAttachmentsData).mockResolvedValueOnce({ error: 'Something went wrong' })

    const result = await Page({ params: Promise.resolve({ meldingId: 123 }) })

    expect(result).toBe('Something went wrong')
  })

  it('renders AddAttachment with the attachments and melding id when successful', async () => {
    vi.mocked(getAttachmentsData).mockResolvedValueOnce(attachments)

    const result = await Page({ params: Promise.resolve({ meldingId: 123 }) })

    render(result)

    expect(AddAttachment).toHaveBeenCalledWith({ attachments, meldingId: 123 }, undefined)
    expect(screen.getByText('AddAttachment Component')).toBeInTheDocument()
  })
})
