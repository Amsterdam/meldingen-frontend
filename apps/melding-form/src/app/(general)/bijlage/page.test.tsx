import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { cookies } from 'next/headers'
import type { Mock } from 'vitest'

import Page, { generateMetadata } from './page'
import { ENDPOINTS } from 'apps/melding-form/src/mocks/endpoints'
import { server } from 'apps/melding-form/src/mocks/node'

vi.mock('./Attachments', () => ({
  Attachments: vi.fn(() => <div>Attachments Component</div>),
}))

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

describe('generateMetadata', () => {
  it('returns the correct metadata title', async () => {
    const metadata = await generateMetadata()

    expect(metadata).toEqual({ title: 'metadata.title' })
  })
})

describe('Page', () => {
  beforeEach(() => {
    // Default mock for cookies
    ;(cookies as Mock).mockReturnValue({
      get: (name: string) => {
        if (name === 'id') {
          return { value: '123' }
        }
        if (name === 'token') {
          return { value: 'test-token' }
        }
        return undefined
      },
    })
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

  it('throws an error if attachments form data is not found', async () => {
    server.use(http.get(ENDPOINTS.GET_STATIC_FORM_BY_STATIC_FORM_ID, () => HttpResponse.json(null)))

    await expect(Page()).rejects.toThrowError('Attachments form data not found.')
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
})
