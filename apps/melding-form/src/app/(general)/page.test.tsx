import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'

import { Home } from './Home'
import Page, { generateMetadata } from './page'
import { textAreaComponent } from 'apps/melding-form/src/mocks/data'
import { ENDPOINTS } from 'apps/melding-form/src/mocks/endpoints'
import { server } from 'apps/melding-form/src/mocks/node'

vi.mock('./Home', () => ({
  Home: vi.fn(() => <div>Home Component</div>),
}))

describe('generateMetadata', () => {
  it('returns the correct metadata title', async () => {
    const metadata = await generateMetadata()

    expect(metadata).toEqual({ title: 'metadata.title' })
  })
})

describe('Page', () => {
  it('renders the Home component with form data', async () => {
    const PageComponent = await Page()

    render(PageComponent)

    expect(screen.getByText('Home Component')).toBeInTheDocument()
    expect(Home).toHaveBeenCalledWith({ formData: [textAreaComponent] }, {})
  })

  it('throws an error if list of static forms cannot be fetched', async () => {
    server.use(http.get(ENDPOINTS.GET_STATIC_FORM, () => HttpResponse.json(null, { status: 500 })))

    await expect(Page()).rejects.toThrowError('Failed to fetch static forms.')
  })

  it('throws an error if list of static forms does not contain a form with type "primary"', async () => {
    server.use(
      http.get(ENDPOINTS.GET_STATIC_FORM, () =>
        HttpResponse.json([
          {
            id: '123',
            type: 'not-primary',
          },
        ]),
      ),
    )

    await expect(Page()).rejects.toThrowError('Primary form id not found.')
  })

  it('throws an error if primary form data cannot be fetched', async () => {
    server.use(http.get(ENDPOINTS.GET_STATIC_FORM_BY_STATIC_FORM_ID, () => HttpResponse.json(null, { status: 500 })))

    await expect(Page()).rejects.toThrowError('Failed to fetch primary form data.')
  })

  it('throws an error if primary form data is not found', async () => {
    server.use(http.get(ENDPOINTS.GET_STATIC_FORM_BY_STATIC_FORM_ID, () => HttpResponse.json(null)))

    await expect(Page()).rejects.toThrowError('Primary form data not found.')
  })
})
