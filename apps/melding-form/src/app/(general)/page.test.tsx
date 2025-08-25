import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { cookies } from 'next/headers'
import { Mock } from 'vitest'

import * as actionsModule from './actions'
import { Home } from './Home'
import Page from './page'
import { melding, textAreaComponent } from 'apps/melding-form/src/mocks/data'
import { ENDPOINTS } from 'apps/melding-form/src/mocks/endpoints'
import { server } from 'apps/melding-form/src/mocks/node'

vi.mock('next/headers', () => ({
  cookies: vi.fn().mockReturnValue({
    get: vi.fn(),
  }),
}))

vi.mock('./actions', () => ({ postPrimaryForm: vi.fn() }))

let capturedAction: ((argsObj: unknown, _: unknown, formData: FormData) => void) | null = null

vi.mock('./Home', () => ({
  Home: vi.fn((props: { action: () => void }) => {
    capturedAction = props.action
    return <div>Home Component</div>
  }),
}))

const mockIdAndTokenCookies = (id = '123', token = 'test-token') => {
  ;(cookies as Mock).mockReturnValue({
    get: (name: string) => {
      if (name === 'id') return { value: id }
      if (name === 'token') return { value: token }
      return undefined
    },
    set: vi.fn(),
  })
}

describe('Page', () => {
  it('renders the Home component with form components', async () => {
    const PageComponent = await Page()

    render(PageComponent)

    expect(screen.getByText('Home Component')).toBeInTheDocument()
    expect(Home).toHaveBeenCalledWith({ action: expect.any(Function), formComponents: [textAreaComponent] }, {})
  })

  it('passes postPrimaryForm with the correct bounded args to Home', async () => {
    mockIdAndTokenCookies()

    const PageComponent = await Page()

    render(PageComponent)

    // Call the bound action
    if (capturedAction) {
      capturedAction({}, undefined, new FormData())
    }

    expect(actionsModule.postPrimaryForm).toHaveBeenCalled()

    const [extraArgs] = (actionsModule.postPrimaryForm as Mock).mock.calls[0]

    expect(extraArgs).toMatchObject({
      existingId: '123',
      existingToken: 'test-token',
    })
  })

  it('passes prefilled formcomponents to Home when cookies are set', async () => {
    mockIdAndTokenCookies()

    const PageComponent = await Page()

    render(PageComponent)

    expect(Home).toHaveBeenCalledWith(
      { action: expect.any(Function), formComponents: [{ ...textAreaComponent, defaultValue: melding.text }] },
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
