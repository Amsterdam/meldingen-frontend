import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { Mock } from 'vitest'

import * as actionsModule from './actions'
import { Home } from './Home'
import Page from './page'
import { melding, textAreaComponent } from 'apps/melding-form/src/mocks/data'
import { ENDPOINTS } from 'apps/melding-form/src/mocks/endpoints'
import { server } from 'apps/melding-form/src/mocks/node'
import { mockIdAndTokenCookies } from 'apps/melding-form/src/mocks/utils'

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

describe('Page', () => {
  it('renders the Home component with form components', async () => {
    const PageComponent = await Page()

    render(PageComponent)

    expect(screen.getByText('Home Component')).toBeInTheDocument()
    expect(Home).toHaveBeenCalledWith({ action: expect.any(Function), formComponents: [textAreaComponent] }, undefined)
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
