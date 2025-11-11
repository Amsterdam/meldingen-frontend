import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'

import { Attachments } from './Attachments'
import Page from './page'
import { textAreaComponent } from 'apps/melding-form/src/mocks/data'
import { ENDPOINTS } from 'apps/melding-form/src/mocks/endpoints'
import { server } from 'apps/melding-form/src/mocks/node'
import { mockIdAndTokenCookies } from 'apps/melding-form/src/mocks/utils'

import { Blob } from 'buffer'

vi.mock('./Attachments', () => ({
  Attachments: vi.fn(() => <div>Attachments Component</div>),
}))

vi.mock('next/headers', () => ({ cookies: vi.fn() }))

describe('Page', () => {
  beforeEach(() => {
    mockIdAndTokenCookies()
  })

  it('renders the Attachments component', async () => {
    const PageComponent = await Page()

    render(PageComponent)

    expect(screen.getByText('Attachments Component')).toBeInTheDocument()
  })

  it('throws an error if list of static forms cannot be fetched', async () => {
    server.use(http.get(ENDPOINTS.GET_STATIC_FORM, () => HttpResponse.json(null, { status: 500 })))

    await expect(Page()).rejects.toThrowError('Failed to fetch static forms.')
  })

  it('throws an error if list of static forms does not contain a form with type "attachments"', async () => {
    server.use(
      http.get(ENDPOINTS.GET_STATIC_FORM, () =>
        HttpResponse.json([
          {
            id: '123',
            type: 'not-attachments',
          },
        ]),
      ),
    )

    await expect(Page()).rejects.toThrowError('Attachments form id not found.')
  })

  it('throws an error if attachments form data cannot be fetched', async () => {
    server.use(http.get(ENDPOINTS.GET_STATIC_FORM_BY_STATIC_FORM_ID, () => HttpResponse.json(null, { status: 500 })))

    await expect(Page()).rejects.toThrowError('Failed to fetch attachments form data.')
  })

  it('throws an error if attachments form label is not found', async () => {
    server.use(
      http.get(ENDPOINTS.GET_STATIC_FORM_BY_STATIC_FORM_ID, () =>
        HttpResponse.json({
          components: [
            {
              type: 'textarea',
              label: '', // No label provided
            },
          ],
        }),
      ),
    )

    await expect(Page()).rejects.toThrowError('Attachments form label not found.')
  })

  it('fetches attachments data and renders Attachments with the correct props', async () => {
    const PageComponent = await Page()

    render(PageComponent)

    expect(Attachments).toHaveBeenCalledWith(
      expect.objectContaining({
        files: [
          {
            blob: expect.any(Blob),
            fileName: 'IMG_0815.jpg',
            serverId: 42,
          },
        ],
        formData: [textAreaComponent],
        meldingId: 123,
        token: 'test-token',
      }),
      undefined,
    )
  })

  it('logs an error to the console when attachments data cannot be fetched', async () => {
    server.use(
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ATTACHMENTS_MELDER, () =>
        HttpResponse.json('Test error', { status: 500 }),
      ),
    )

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const PageComponent = await Page()

    render(PageComponent)

    expect(consoleSpy).toHaveBeenCalledWith('Test error')

    consoleSpy.mockRestore()
  })

  it('throws an error if attachments cannot be fetched', async () => {
    server.use(
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ATTACHMENT_BY_ATTACHMENT_ID_DOWNLOAD, () =>
        HttpResponse.json({ detail: 'Error message' }, { status: 500 }),
      ),
    )

    await expect(Page()).rejects.toThrowError('Failed to fetch attachment download.')
  })
})
