import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'

import { ENDPOINTS } from 'apps/public/src/mocks/endpoints'
import mockFormData from 'apps/public/src/mocks/mockFormData.json'
import { server } from 'apps/public/src/mocks/node'

import { Home } from './Home'
import Page from './page'

vi.mock('./Home', () => ({
  Home: vi.fn(() => <div>Home Component</div>),
}))

describe('Page', () => {
  it('renders the Home component with form data', async () => {
    const PageComponent = await Page()

    render(PageComponent)

    expect(screen.getByText('Home Component')).toBeInTheDocument()
    expect(Home).toHaveBeenCalledWith({ formData: mockFormData.components }, {})
  })

  it('returns undefined if no primary form is found', async () => {
    server.use(
      http.get(ENDPOINTS.STATIC_FORM, () =>
        HttpResponse.json([
          {
            id: '123',
            type: 'not-primary',
          },
        ]),
      ),
    )

    const PageComponent = await Page()

    expect(PageComponent).toBeUndefined()
  })
})
