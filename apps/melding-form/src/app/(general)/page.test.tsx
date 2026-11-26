import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'

import { Home } from './Home'
import Page from './page'
import { melding, textAreaComponent } from '~/mocks/data'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'
import { mockIdAndTokenCookies } from '~/mocks/utils'

vi.mock('next/headers', () => ({
  cookies: vi.fn().mockReturnValue({
    get: vi.fn(),
  }),
}))

vi.mock('./Home', () => ({
  Home: vi.fn(() => <div>Home Component</div>),
}))

describe('Page', () => {
  it('renders the Home component with form components', async () => {
    const PageComponent = await Page()

    render(PageComponent)

    expect(screen.getByText('Home Component')).toBeInTheDocument()
    expect(Home).toHaveBeenCalledWith({ formComponents: [textAreaComponent] }, undefined)
  })

  it('passes prefilled formcomponents to Home when cookies are set', async () => {
    mockIdAndTokenCookies()

    const PageComponent = await Page()

    render(PageComponent)

    expect(Home).toHaveBeenCalledWith(
      { formComponents: [{ ...textAreaComponent, defaultValue: melding.text }] },
      undefined,
    )
  })

  it('logs an error to the console when melding data cannot be fetched', async () => {
    server.use(
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_MELDER, () => HttpResponse.json('Test error', { status: 500 })),
    )

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const PageComponent = await Page()

    render(PageComponent)

    expect(consoleSpy).toHaveBeenCalledWith('Test error')

    consoleSpy.mockRestore()
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
})
