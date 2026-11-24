import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'

import type { MeldingAttachment } from '../types'

import { getAttachmentsData } from '../_utils/server'
import { AddAttachment } from './AddAttachment'
import Page from './page'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'

vi.mock('./AddAttachment', () => ({
  AddAttachment: vi.fn(() => <div>AddAttachment Component</div>),
}))

vi.mock('../_utils/server', { spy: true })

const attachments: MeldingAttachment[] = []

describe('Page', () => {
  it('shows not found when the melding does not exist', async () => {
    server.use(http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ATTACHMENTS, () => HttpResponse.json({}, { status: 404 })))

    await expect(Page({ params: Promise.resolve({ meldingId: '123' }) })).rejects.toThrow(
      'NEXT_HTTP_ERROR_FALLBACK;404',
    )
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

    expect(getAttachmentsData).toHaveBeenCalledWith(123, 'thumbnail')
  })

  it('renders the error message when getAttachmentsData rejects', async () => {
    vi.mocked(getAttachmentsData).mockRejectedValueOnce('Something went wrong')

    await expect(Page({ params: Promise.resolve({ meldingId: '123' }) })).rejects.toBe('Something went wrong')
  })

  it('renders AddAttachment with the attachments and melding id when successful', async () => {
    vi.mocked(getAttachmentsData).mockResolvedValueOnce(attachments)

    const result = await Page({ params: Promise.resolve({ meldingId: '123' }) })

    render(result)

    expect(AddAttachment).toHaveBeenCalledWith({ attachments, meldingId: 123 }, undefined)
    expect(screen.getByText('AddAttachment Component')).toBeInTheDocument()
  })
})
