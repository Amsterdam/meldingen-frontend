import { render, screen } from '@testing-library/react'

import type { MeldingAttachment } from '../types'

import { getAttachmentsData } from '../_utils/server'
import { AddAttachment } from './AddAttachment'
import Page from './page'

vi.mock('./AddAttachment', () => ({
  AddAttachment: vi.fn(() => <div>AddAttachment Component</div>),
}))

vi.mock('../_utils/server', () => ({
  getAttachmentsData: vi.fn(),
}))

const attachments: MeldingAttachment[] = []

describe('Page', () => {
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
