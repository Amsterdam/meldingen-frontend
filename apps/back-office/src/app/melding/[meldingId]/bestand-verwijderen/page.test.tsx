import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { redirect } from 'next/navigation'

import type { GetAttachmentsDataResult } from '../_utils/getAttachmentsData'
import type { MeldingAttachment } from '../types'

import { getAttachmentsData } from '../_utils'
import { Attachments } from './_components/Attachments'
import Page, { generateMetadata } from './page'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'

vi.mock('./_components/Attachments', () => ({
  Attachments: vi.fn(() => <div>Attachments Component</div>),
}))

vi.mock('../_utils', () => ({
  getAttachmentsData: vi.fn(),
}))

vi.mock('next-intl/server', async () => ({
  getTranslations: () =>
    vi.fn().mockImplementation((key, params) => (params ? `${key}: ${JSON.stringify(params)}` : key)),
}))

const attachmentFiles: MeldingAttachment[] = [
  {
    blob: new Blob(['file-content'], { type: 'image/png' }),
    createdAt: '2024-01-01 10:30',
    id: 1,
    originalFilename: 'bewijs.png',
    updatedAt: '2024-01-01 10:30',
    user: {
      email: 'behandelaar@example.com',
      id: 10,
      username: 'behandelaar',
    },
  },
]

const attachments: GetAttachmentsDataResult = {
  attachmentsWithFile: attachmentFiles,
}

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
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls getAttachmentsData with the melding id', async () => {
    vi.mocked(getAttachmentsData).mockResolvedValueOnce(attachments)

    await Page({ params: Promise.resolve({ meldingId: 123 }) })

    expect(getAttachmentsData).toHaveBeenCalledWith(123)
  })

  it('renders the error message when getAttachmentsData rejects', async () => {
    vi.mocked(getAttachmentsData).mockRejectedValueOnce('Something went wrong')

    await expect(Page({ params: Promise.resolve({ meldingId: 123 }) })).rejects.toBe('Something went wrong')
  })

  it('redirects to the detail page when there are no attachments', async () => {
    const redirectSignal = new Error('NEXT_REDIRECT')

    vi.mocked(getAttachmentsData).mockResolvedValueOnce({ attachmentsWithFile: [] })
    vi.mocked(redirect).mockImplementationOnce(() => {
      throw redirectSignal
    })

    await expect(Page({ params: Promise.resolve({ meldingId: 123 }) })).rejects.toBe(redirectSignal)

    expect(redirect).toHaveBeenCalledWith('/melding/123')
  })

  it('renders Attachments with the attachments and melding id when successful', async () => {
    vi.mocked(getAttachmentsData).mockResolvedValueOnce(attachments)

    const result = await Page({ params: Promise.resolve({ meldingId: 123 }) })

    render(result)

    expect(Attachments).toHaveBeenCalledWith(
      {
        attachments,
        meldingId: 123,
      },
      undefined,
    )
    expect(screen.getByText('Attachments Component')).toBeInTheDocument()
  })
})
