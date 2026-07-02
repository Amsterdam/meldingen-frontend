import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'

import { MeldingForm } from './MeldingForm'
import Page, { generateMetadata } from './page'
import { melding, textAreaComponent } from '~/mocks/data'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'

vi.mock('./MeldingForm', () => ({
  MeldingForm: vi.fn(() => <div>MeldingForm Component</div>),
}))

describe('generateMetadata', () => {
  it('returns the correct metadata title', async () => {
    const metadata = await generateMetadata()

    expect(metadata).toEqual({ title: 'metadata.title' })
  })
})

describe('Page', () => {
  const sources = [
    { id: 1, name: 'Brievenbus' },
    { id: 2, name: 'E-mail' },
    { id: 3, name: 'Telefoon' },
  ]

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

  it('throws an error if sources cannot be fetched', async () => {
    server.use(http.get(ENDPOINTS.GET_SOURCE, () => HttpResponse.json(null, { status: 500 })))

    await expect(Page({ searchParams: Promise.resolve({}) })).rejects.toThrowError('Failed to fetch sources.')
  })

  it('throws an error if sources list is empty', async () => {
    server.use(http.get(ENDPOINTS.GET_SOURCE, () => HttpResponse.json([])))

    await expect(Page({ searchParams: Promise.resolve({}) })).rejects.toThrowError('No sources found.')
  })

  it('throws an error if labels cannot be fetched', async () => {
    server.use(http.get(ENDPOINTS.GET_LABEL, () => HttpResponse.json(null, { status: 500 })))

    await expect(Page({ searchParams: Promise.resolve({}) })).rejects.toThrowError('Failed to fetch labels.')
  })

  it('throws an error if labels list is empty', async () => {
    server.use(http.get(ENDPOINTS.GET_LABEL, () => HttpResponse.json([])))

    await expect(Page({ searchParams: Promise.resolve({}) })).rejects.toThrowError('No labels found.')
  })

  it('renders the MeldingForm component with form components', async () => {
    const PageComponent = await Page({ searchParams: Promise.resolve({}) })

    render(PageComponent)

    expect(screen.getByText('MeldingForm Component')).toBeInTheDocument()
    expect(MeldingForm).toHaveBeenCalledWith(
      {
        defaultValues: {},
        existingId: undefined,
        existingMelding: undefined,
        existingToken: undefined,
        labels: [
          { id: 0, name: 'Label 1' },
          { id: 1, name: 'Label 2' },
          { id: 2, name: 'Label 3' },
        ],
        primaryTextArea: textAreaComponent,
        sources,
      },
      undefined,
    )
  })

  it('renders the MeldingForm component with default values when id and token are provided and melding exists', async () => {
    const meldingData = {
      classification: melding.classification,
      created_at: melding.created_at,
      id: melding.id,
      labels: melding.labels,
      public_id: melding.public_id,
      source: melding.source,
      text: 'Prefilled text',
      urgency: -1,
    }
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

    const PageComponent = await Page({ searchParams: Promise.resolve({ id: 1, token: 'valid-token' }) })

    render(PageComponent)

    expect(MeldingForm).toHaveBeenCalledWith(
      expect.objectContaining({
        defaultValues: { labels: [0, 1], primary: 'Prefilled text', source: String(melding.source?.id), urgency: -1 },
      }),
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

    const PageComponent = await Page({ searchParams: Promise.resolve({ id: 1, token: 'valid-token' }) })

    render(PageComponent)

    expect(consoleErrorSpy).toHaveBeenCalledWith('Test error')

    expect(MeldingForm).toHaveBeenCalledWith(
      expect.objectContaining({
        defaultValues: {},
      }),
      undefined,
    )

    consoleErrorSpy.mockRestore()
  })

  it('passes the existing note to the MeldingForm component when it exists', async () => {
    const noteData = { id: 1, melding_id: 1, text: 'Existing note text' }

    server.use(http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_NOTE, () => HttpResponse.json([noteData])))

    const PageComponent = await Page({ searchParams: Promise.resolve({ id: 1, token: 'valid-token' }) })

    render(PageComponent)

    expect(MeldingForm).toHaveBeenCalledWith(
      expect.objectContaining({
        existingNote: noteData,
      }),
      undefined,
    )
  })

  it('logs an error and renders the MeldingForm component with undefined existingNote when fetching note data fails', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    server.use(
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_NOTE, () => HttpResponse.json('Test error', { status: 500 })),
    )

    const PageComponent = await Page({ searchParams: Promise.resolve({ id: 1, token: 'valid-token' }) })

    render(PageComponent)

    expect(consoleErrorSpy).toHaveBeenCalledWith('Test error')

    expect(MeldingForm).toHaveBeenCalledWith(
      expect.objectContaining({
        existingNote: undefined,
      }),
      undefined,
    )

    consoleErrorSpy.mockRestore()
  })

  it('renders the MeldingForm component with empty default values when id and token are provided but melding does not have necessary data', async () => {
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

    const PageComponent = await Page({ searchParams: Promise.resolve({ id: 1, token: 'valid-token' }) })

    render(PageComponent)

    expect(MeldingForm).toHaveBeenCalledWith(
      expect.objectContaining({
        defaultValues: {
          labels: [],
          primary: undefined,
          source: undefined,
          urgency: undefined,
        },
      }),
      undefined,
    )
  })
})
