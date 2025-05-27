import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'

import { Home } from './Home'
import Page from './page'
import { textAreaComponent } from 'apps/melding-form/src/mocks/data'
import { ENDPOINTS } from 'apps/melding-form/src/mocks/endpoints'
import { server } from 'apps/melding-form/src/mocks/node'

vi.mock('./Home', () => ({
  Home: vi.fn(() => <div>Home Component</div>),
}))

describe('Page', () => {
  it('renders the Home component with form data', async () => {
    const PageComponent = await Page()

    render(PageComponent)

    expect(screen.getByText('Home Component')).toBeInTheDocument()
    expect(Home).toHaveBeenCalledWith({ formData: [textAreaComponent] }, {})
  })

  it('throws an error if no primary form is found', async () => {
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

    const PageComponent = await Page()

    render(PageComponent)

    expect(screen.getByText('Primary form id not found')).toBeInTheDocument()
  })
})
