import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { redirect } from 'next/navigation'

import type { MeldingAttachment } from '../types'

import { getAttachmentsData } from '../_utils/server'
import { DeleteAttachment } from './DeleteAttachment'
import Page, { generateMetadata } from './page'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'

vi.mock('./DeleteAttachment', () => ({
  DeleteAttachment: vi.fn(() => <div>Attachments Component</div>),
}))

vi.mock('../_utils/server', { spy: true })

const attachments: MeldingAttachment[] = [
  {
    blob: new Blob(['file-content'], { type: 'image/png' }),
    createdAt: '2024-01-01T10:30:00Z',
    id: 1,
    originalFilename: 'bewijs.png',
    updatedAt: '2024-01-01T10:30:00Z',
    user: {
      email: 'behandelaar@example.com',
      id: 10,
      username: 'behandelaar',
    },
  },
]

describe('generateMetadata', () => {
  it('returns the correct metadata title', async () => {
    const metadata = await generateMetadata()

    expect(metadata).toEqual({ title: 'metadata.title' })
  })
})

describe('Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows not found when the melding does not exist', async () => {
    server.use(http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ATTACHMENTS, () => HttpResponse.json({}, { status: 404 })))

    await expect(Page({ params: Promise.resolve({ meldingId: '123' }) })).rejects.toThrow(
      'NEXT_HTTP_ERROR_FALLBACK;404',
    )
    expect(redirect).not.toHaveBeenCalledWith('/melding/123')
  })

  it.each([403, 500])('throws an error when fetching melding attachments returns %s', async (status) => {
    server.use(http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ATTACHMENTS, () => HttpResponse.json({}, { status })))

    await expect(Page({ params: Promise.resolve({ meldingId: '123' }) })).rejects.toThrow(
      'Failed to fetch melding attachments.',
    )
  })

  it('calls getAttachmentsData with the melding id', async () => {
    vi.mocked(getAttachmentsData).mockResolvedValueOnce(attachments)

    await Page({ params: Promise.resolve({ meldingId: '123' }) })

    expect(getAttachmentsData).toHaveBeenCalledWith(123, 'optimized')
  })

  it('renders the error message when getAttachmentsData rejects', async () => {
    vi.mocked(getAttachmentsData).mockRejectedValueOnce('Something went wrong')

    await expect(Page({ params: Promise.resolve({ meldingId: '123' }) })).rejects.toBe('Something went wrong')
  })

  it('redirects to the detail page when there are no attachments', async () => {
    const redirectSignal = new Error('NEXT_REDIRECT')

    vi.mocked(getAttachmentsData).mockResolvedValueOnce([])
    vi.mocked(redirect).mockImplementationOnce(() => {
      throw redirectSignal
    })

    await expect(Page({ params: Promise.resolve({ meldingId: '123' }) })).rejects.toBe(redirectSignal)

    expect(redirect).toHaveBeenCalledWith('/melding/123')
  })

  it('renders Attachments with the attachments and melding id when successful', async () => {
    vi.mocked(getAttachmentsData).mockResolvedValueOnce(attachments)

    const result = await Page({ params: Promise.resolve({ meldingId: '123' }) })

    render(result)

    expect(DeleteAttachment).toHaveBeenCalledWith(
      {
        attachments,
        meldingId: 123,
      },
      undefined,
    )
    expect(screen.getByText('Attachments Component')).toBeInTheDocument()
  })
})
