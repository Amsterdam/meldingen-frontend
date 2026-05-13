import type { Mock } from 'vitest'

import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'

import * as actionsModule from './actions'
import { MeldingForm } from './MeldingForm'
import Page, { generateMetadata } from './page'
import { textAreaComponent } from '~/mocks/data'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'

vi.mock('./actions', () => ({ postMeldingForm: vi.fn() }))

let capturedAction: ((prevState: unknown, formData: FormData) => void) | null = null

vi.mock('./MeldingForm', () => ({
  MeldingForm: vi.fn((props: { action: () => void }) => {
    capturedAction = props.action
    return <div>MeldingForm Component</div>
  }),
}))

describe('generateMetadata', () => {
  it('returns the correct metadata title', async () => {
    const metadata = await generateMetadata()

    expect(metadata).toEqual({ title: 'metadata.title' })
  })
})

describe('Page', () => {
  it('throws an error if list of static forms cannot be fetched', async () => {
    server.use(http.get(ENDPOINTS.GET_STATIC_FORM, () => HttpResponse.json(null, { status: 500 })))

    await expect(Page({ searchParams: Promise.resolve({}) })).rejects.toThrowError('Failed to fetch static forms.')
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

    await expect(Page({ searchParams: Promise.resolve({}) })).rejects.toThrowError('Primary form id not found.')
  })

  it('throws an error if primary form data cannot be fetched', async () => {
    server.use(http.get(ENDPOINTS.GET_STATIC_FORM_BY_STATIC_FORM_ID, () => HttpResponse.json(null, { status: 500 })))

    await expect(Page({ searchParams: Promise.resolve({}) })).rejects.toThrowError('Failed to fetch primary form data.')
  })

  it('throws an error if primary form does not contain a textarea component', async () => {
    server.use(
      http.get(ENDPOINTS.GET_STATIC_FORM_BY_STATIC_FORM_ID, () =>
        HttpResponse.json({
          components: [
            {
              id: '456',
              type: 'not-textarea',
            },
          ],
          id: '123',
          type: 'primary',
        }),
      ),
    )

    await expect(Page({ searchParams: Promise.resolve({}) })).rejects.toThrowError('Primary form textarea not found.')
  })

  it('renders the MeldingForm component with form components', async () => {
    const PageComponent = await Page({ searchParams: Promise.resolve({}) })

    render(PageComponent)

    expect(screen.getByText('MeldingForm Component')).toBeInTheDocument()
    expect(MeldingForm).toHaveBeenCalledWith(
      { action: expect.any(Function), defaultValues: {}, primaryTextArea: textAreaComponent },
      undefined,
    )
  })

  it('renders the MeldingForm component with default values when id and token are provided and melding exists', async () => {
    const meldingData = { text: 'Prefilled text', urgency: -1 }
    server.use(
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID, () => HttpResponse.json(meldingData)),
      http.get(ENDPOINTS.GET_STATIC_FORM_BY_STATIC_FORM_ID, () =>
        HttpResponse.json({
          components: [{ ...textAreaComponent, key: 'primary' }],
          id: '123',
          type: 'primary',
        }),
      ),
    )

    const PageComponent = await Page({ searchParams: Promise.resolve({ id: '1', token: 'valid-token' }) })

    render(PageComponent)

    expect(MeldingForm).toHaveBeenCalledWith(
      {
        action: expect.any(Function),
        defaultValues: { primary: 'Prefilled text', urgency: -1 },
        primaryTextArea: { ...textAreaComponent, key: 'primary' },
      },
      undefined,
    )
  })

  it('logs an error and renders the MeldingForm component with empty default values when fetching melding data fails', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    server.use(
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID, () => HttpResponse.json('Test error', { status: 500 })),
      http.get(ENDPOINTS.GET_STATIC_FORM_BY_STATIC_FORM_ID, () =>
        HttpResponse.json({
          components: [{ ...textAreaComponent, key: 'primary' }],
          id: '123',
          type: 'primary',
        }),
      ),
    )

    const PageComponent = await Page({ searchParams: Promise.resolve({ id: '1', token: 'valid-token' }) })

    render(PageComponent)

    expect(consoleErrorSpy).toHaveBeenCalledWith('Test error')

    expect(MeldingForm).toHaveBeenCalledWith(
      {
        action: expect.any(Function),
        defaultValues: {},
        primaryTextArea: { ...textAreaComponent, key: 'primary' },
      },
      undefined,
    )

    consoleErrorSpy.mockRestore()
  })

  it('renders the MeldingForm component with undefined default values when id and token are provided but melding does not have necessary data', async () => {
    server.use(
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID, () => HttpResponse.json({})),
      http.get(ENDPOINTS.GET_STATIC_FORM_BY_STATIC_FORM_ID, () =>
        HttpResponse.json({
          components: [{ ...textAreaComponent, key: 'primary' }],
          id: '123',
          type: 'primary',
        }),
      ),
    )

    const PageComponent = await Page({ searchParams: Promise.resolve({ id: '1', token: 'valid-token' }) })

    render(PageComponent)

    expect(MeldingForm).toHaveBeenCalledWith(
      {
        action: expect.any(Function),
        defaultValues: {
          primary: undefined,
          urgency: undefined,
        },
        primaryTextArea: { ...textAreaComponent, key: 'primary' },
      },
      undefined,
    )
  })

  it('passes postPrimaryForm with the correct bounded args to Home', async () => {
    const PageComponent = await Page({ searchParams: Promise.resolve({}) })

    render(PageComponent)

    // Call the bound action
    if (capturedAction) {
      capturedAction({}, new FormData())
    }

    expect(actionsModule.postMeldingForm).toHaveBeenCalled()

    const [extraArgs] = (actionsModule.postMeldingForm as Mock).mock.calls[0]

    expect(extraArgs).toMatchObject({ requiredErrorMessage: 'required-error-message-fallback' })
  })

  it('passes a custom required error message when it is set', async () => {
    const primaryFormWithCustomErrorMessage = {
      components: [
        {
          ...textAreaComponent,
          key: 'primary',
          validate: {
            required: true,
            required_error_message: 'Custom error message',
          },
        },
      ],
    }
    server.use(
      http.get(ENDPOINTS.GET_STATIC_FORM_BY_STATIC_FORM_ID, () => HttpResponse.json(primaryFormWithCustomErrorMessage)),
    )

    const PageComponent = await Page({ searchParams: Promise.resolve({}) })

    render(PageComponent)

    // Call the bound action
    if (capturedAction) {
      capturedAction({}, new FormData())
    }

    expect(actionsModule.postMeldingForm).toHaveBeenCalled()

    const [extraArgs] = (actionsModule.postMeldingForm as Mock).mock.calls[0]

    expect(extraArgs).toMatchObject({ requiredErrorMessage: 'Custom error message' })
  })
})
