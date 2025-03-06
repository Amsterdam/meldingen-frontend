import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'

import { ENDPOINTS } from 'apps/public/src/mocks/endpoints'
import { server } from 'apps/public/src/mocks/node'

import Page from './page'

vi.mock('./Contact', () => ({
  Contact: vi.fn(() => <div>Contact Component</div>),
}))

describe('Page', () => {
  it('renders the Contact component', async () => {
    server.use(
      http.get(ENDPOINTS.STATIC_FORM, () =>
        HttpResponse.json([
          {
            id: '123',
            type: 'contact',
          },
        ]),
      ),
    )

    const PageComponent = await Page()

    render(PageComponent)

    expect(screen.getByText('Contact Component')).toBeInTheDocument()
  })

  it('shows an error message if no contact form is found', async () => {
    server.use(
      http.get(ENDPOINTS.STATIC_FORM, () =>
        HttpResponse.json([
          {
            id: '123',
            type: 'not-contact',
          },
        ]),
      ),
    )

    const PageComponent = await Page()

    render(PageComponent)

    expect(screen.getByText('Contact form id not found')).toBeInTheDocument()
  })
})
