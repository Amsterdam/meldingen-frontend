import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { createTranslator } from 'next-intl'

import messages from '../../../translations/nl.json'
import Page, { generateMetadata } from './page'
import { getClientEnv } from '~/env/client'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'

vi.mock('next-intl/server', async () => ({
  getTranslations: () =>
    vi.fn().mockImplementation((key, params) => (params ? `${key}:${JSON.stringify(params)}` : key)),
}))

describe('generateMetadata', () => {
  it('returns the correct metadata title', async () => {
    const metadata = await generateMetadata()

    expect(metadata).toEqual({ title: 'metadata.title' })
  })
})

describe('thanks description', () => {
  it('omits the heading and objective text when no service objective is provided', () => {
    const t = createTranslator({ locale: 'nl', messages, namespace: 'thanks' })

    const description = t('description', {
      date: 'undefined',
      publicId: 'undefined',
      serviceLevelObjectiveText: 'undefined',
      time: 'undefined',
    })

    expect(description).not.toContain('Wat doen we met uw melding?')
    expect(description).not.toContain('Meldingen pakken we binnen 3 werkdagen op.')
    expect(description).toContain('U ontvangt een e-mail met alle gegevens van uw melding.\n\n## Vragen')
  })

  it('renders the heading and service objective when provided', () => {
    const serviceLevelObjectiveText = 'Wij lossen uw melding binnen 5 werkdagen op.'
    const t = createTranslator({ locale: 'nl', messages, namespace: 'thanks' })

    const description = t('description', {
      date: 'undefined',
      publicId: 'undefined',
      serviceLevelObjectiveText,
      time: 'undefined',
    })

    expect(description).toContain(`## Wat doen we met uw melding?\n\n${serviceLevelObjectiveText}\n\n## Vragen`)
  })
})

describe('Page', () => {
  it.each([{ classificationId: '65' }, { classificationId: ['65', '66'] }])(
    'fetches classification $classificationId with a numeric filter and renders its text',
    async ({ classificationId }) => {
      const serviceLevelObjectiveText = 'Wij lossen uw melding binnen 5 werkdagen op.'
      const handler = vi.fn(({ request }: { request: Request }) => {
        expect(new URL(request.url).searchParams.get('filter')).toBe('{"id_in":[65]}')

        return HttpResponse.json([{ service_level_objective_text: serviceLevelObjectiveText }])
      })

      server.use(http.get(ENDPOINTS.GET_CLASSIFICATION, handler))

      render(await Page({ searchParams: Promise.resolve({ classification_id: classificationId }) }))

      expect(handler).toHaveBeenCalledTimes(1)
      expect(screen.getByText(`description:${JSON.stringify({ serviceLevelObjectiveText })}`)).toBeInTheDocument()
    },
  )

  it('does not fetch classifications when no classification ID is provided', async () => {
    const handler = vi.fn(() => HttpResponse.json([]))

    server.use(http.get(ENDPOINTS.GET_CLASSIFICATION, handler))

    render(await Page({ searchParams: Promise.resolve({}) }))

    expect(handler).not.toHaveBeenCalled()
    expect(screen.getByText('description:{}')).toBeInTheDocument()
  })

  it('leaves the service objective undefined when no classification matches', async () => {
    server.use(http.get(ENDPOINTS.GET_CLASSIFICATION, () => HttpResponse.json([])))

    render(await Page({ searchParams: Promise.resolve({ classification_id: '65' }) }))

    expect(screen.getByText('description:{}')).toBeInTheDocument()
  })

  it('leaves the service objective undefined when its text is empty', async () => {
    server.use(http.get(ENDPOINTS.GET_CLASSIFICATION, () => HttpResponse.json([{ service_level_objective_text: '' }])))

    render(await Page({ searchParams: Promise.resolve({ classification_id: '65' }) }))

    expect(screen.getByText('description:{}')).toBeInTheDocument()
  })

  it('renders page', async () => {
    const searchParams = Promise.resolve({ created_at: '2025-05-26T11:56:34.081Z', public_id: '1234' })

    const PageComponent = await Page({ searchParams })

    render(PageComponent)

    const heading = screen.getByRole('heading', { level: 1, name: 'title' })
    const paragraph = screen.getByText('description:{"date":"26-05-2025","publicId":"1234","time":"13:56"}')
    const link = screen.getByRole('link', { name: 'link' })

    expect(heading).toBeInTheDocument()
    expect(paragraph).toBeInTheDocument()
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/#top')
  })

  it('uses the first value when search params are arrays', async () => {
    const searchParams = Promise.resolve({
      created_at: ['2025-05-26T11:56:34.081Z', '2026-01-01T00:00:00.000Z'],
      public_id: ['1234', '5678'],
    })

    const PageComponent = await Page({ searchParams })

    render(PageComponent)

    const paragraph = screen.getByText('description:{"date":"26-05-2025","publicId":"1234","time":"13:56"}')

    expect(paragraph).toBeInTheDocument()
  })

  it('renders a description without publicId', async () => {
    const searchParams = Promise.resolve({ created_at: '2025-05-26T11:56:34.081Z', public_id: undefined })

    const PageComponent = await Page({ searchParams })

    render(PageComponent)

    const description = screen.getByText('description:{"date":"26-05-2025","time":"13:56"}')

    expect(description).toBeInTheDocument()
  })

  it('renders a description without date and time', async () => {
    const searchParams = Promise.resolve({ created_at: undefined, public_id: '1234' })

    const PageComponent = await Page({ searchParams })

    render(PageComponent)

    const description = screen.getByText('description:{"publicId":"1234"}')

    expect(description).toBeInTheDocument()
  })

  it('renders the publicId as a link when source is back-office', async () => {
    const searchParams = Promise.resolve({
      created_at: '2025-05-26T11:56:34.081Z',
      id: '10',
      public_id: '1234',
      source: 'back-office',
    })

    const PageComponent = await Page({ searchParams })

    render(PageComponent)

    const link = screen.getByRole('link', { name: '1234' })

    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', `${getClientEnv().NEXT_PUBLIC_BACK_OFFICE_BASE_URL}/melding/10?id=1234`)
  })

  it('uses the first source value when source is an array', async () => {
    const searchParams = Promise.resolve({
      created_at: '2025-05-26T11:56:34.081Z',
      id: '10',
      public_id: '1234',
      source: ['back-office', 'melding-form'],
    })

    const PageComponent = await Page({ searchParams })

    render(PageComponent)

    const link = screen.getByRole('link', { name: '1234' })

    expect(link).toHaveAttribute('href', `${getClientEnv().NEXT_PUBLIC_BACK_OFFICE_BASE_URL}/melding/10?id=1234`)
  })

  it('uses the first id value when id is an array', async () => {
    const searchParams = Promise.resolve({
      created_at: '2025-05-26T11:56:34.081Z',
      id: ['10', '20'],
      public_id: '1234',
      source: 'back-office',
    })

    const PageComponent = await Page({ searchParams })

    render(PageComponent)

    const link = screen.getByRole('link', { name: '1234' })

    expect(link).toHaveAttribute('href', `${getClientEnv().NEXT_PUBLIC_BACK_OFFICE_BASE_URL}/melding/10?id=1234`)
  })

  it('links to the back-office melden page when source is back-office', async () => {
    const searchParams = Promise.resolve({
      created_at: '2025-05-26T11:56:34.081Z',
      id: '10',
      public_id: '1234',
      source: 'back-office',
    })

    const PageComponent = await Page({ searchParams })

    render(PageComponent)

    const link = screen.getByRole('link', { name: 'link' })

    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', `${getClientEnv().NEXT_PUBLIC_BACK_OFFICE_BASE_URL}/melden`)
  })
})
