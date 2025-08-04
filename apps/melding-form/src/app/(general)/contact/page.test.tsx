import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'

import Page from './page'
import { ENDPOINTS } from 'apps/melding-form/src/mocks/endpoints'
import { server } from 'apps/melding-form/src/mocks/node'

vi.mock('./Contact', () => ({
  Contact: vi.fn(() => <div>Contact Component</div>),
}))

describe('Page', () => {
  it('renders the Contact component', async () => {
    const PageComponent = await Page()

    render(PageComponent)

    expect(screen.getByText('Contact Component')).toBeInTheDocument()
  })

  it('throws an error if list of static forms cannot be fetched', async () => {
    server.use(http.get(ENDPOINTS.GET_STATIC_FORM, () => HttpResponse.json(null, { status: 500 })))

    await expect(Page()).rejects.toThrowError('Failed to fetch static forms.')
  })

  it('throws an error if no contact form is found', async () => {
    server.use(
      http.get(ENDPOINTS.GET_STATIC_FORM, () =>
        HttpResponse.json([
          {
            id: '123',
            type: 'not-contact',
          },
        ]),
      ),
    )

    await expect(Page()).rejects.toThrowError('Contact form id not found.')
  })

  it('throws an error if contact form data cannot be fetched', async () => {
    server.use(http.get(ENDPOINTS.GET_STATIC_FORM_BY_STATIC_FORM_ID, () => HttpResponse.json(null, { status: 500 })))

    await expect(Page()).rejects.toThrowError('Failed to fetch contact form data.')
  })

  it('throws an error if contact form data is not found', async () => {
    server.use(http.get(ENDPOINTS.GET_STATIC_FORM_BY_STATIC_FORM_ID, () => HttpResponse.json(null)))

    await expect(Page()).rejects.toThrowError('Contact form data not found.')
  })

  it('throws an error if contact form label is not found', async () => {
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

    await expect(Page()).rejects.toThrowError('Contact form labels not found.')
  })
})
