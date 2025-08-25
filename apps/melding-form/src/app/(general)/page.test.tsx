import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { cookies } from 'next/headers'
import { Mock } from 'vitest'

import { Home } from './Home'
import Page from './page'
import { textAreaComponent } from 'apps/melding-form/src/mocks/data'
import { ENDPOINTS } from 'apps/melding-form/src/mocks/endpoints'
import { server } from 'apps/melding-form/src/mocks/node'

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

vi.mock('./Home', () => ({
  Home: vi.fn(() => <div>Home Component</div>),
}))

describe('Page', () => {
  const mockCookies = (id?: string, token?: string) => {
    ;(cookies as Mock).mockReturnValue({
      get: (name: string) => {
        if (name === 'id') return { value: id }
        if (name === 'token') return { value: token }
        return undefined
      },
      set: vi.fn(),
    })
  }

  beforeEach(() => {
    // Default mock for cookies
    ;(cookies as Mock).mockReturnValue({
      get: vi.fn(),
    })
  })

  it('renders the Home component with form components', async () => {
    const PageComponent = await Page()

    render(PageComponent)

    expect(screen.getByText('Home Component')).toBeInTheDocument()
    expect(Home).toHaveBeenCalledWith({ formComponents: [textAreaComponent] }, {})
  })

  it('renders the Home component with prefilled form components if session cookies exist', async () => {
    mockCookies('123', 'test-token')

    const PageComponent = await Page()

    render(PageComponent)

    expect(screen.getByText('Home Component')).toBeInTheDocument()
    expect(Home).toHaveBeenCalledWith(
      { formComponents: [{ ...textAreaComponent, defaultValue: 'Alles' }], id: '123', token: 'test-token' },
      {},
    )
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
