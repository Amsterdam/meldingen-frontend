import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { cookies } from 'next/headers'
import type { Mock } from 'vitest'

import { ENDPOINTS } from 'apps/public/src/mocks/endpoints'
import mockAdditionalQuestionsAnswerData from 'apps/public/src/mocks/mockAdditionalQuestionsAnswerData.json'
import mockFormData from 'apps/public/src/mocks/mockFormData.json'
import mockMeldingData from 'apps/public/src/mocks/mockMeldingData.json'
import { server } from 'apps/public/src/mocks/node'

import Page from './page'
import { Summary } from './Summary'

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

vi.mock('./Summary', () => ({
  Summary: vi.fn(() => <div>Summary Component</div>),
}))

describe('Page', () => {
  const mockCookies = {
    get: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(cookies as Mock).mockReturnValue(mockCookies)
  })

  it('renders the Summary component', async () => {
    mockCookies.get.mockImplementation((name) => {
      if (name === 'id') {
        return { value: '123' }
      }
      if (name === 'token') {
        return { value: 'z123890' }
      }
      if (name === 'location') {
        return {
          value: '{"name":"Test address"}',
        }
      }
      return undefined
    })

    const PageComponent = await Page()

    render(PageComponent)

    expect(screen.getByText('Summary Component')).toBeInTheDocument()
    expect(Summary).toHaveBeenCalledWith(
      {
        data: [
          {
            description: [mockMeldingData.text],
            key: 'primary',
            term: mockFormData.components[0].components[0].label,
          },
          ...mockAdditionalQuestionsAnswerData.map((item) => ({
            description: [item.text],
            key: item.question.id,
            term: item.question.text,
          })),
          {
            description: ['Test address'],
            key: 'location',
            term: 'location.title',
          },
          {
            description: ['email@email.email', '0612345678'],
            key: 'contact',
            term: 'summary.contact-label',
          },
        ],
      },
      {},
    )
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

  it('returns undefined when there is no meldingId and token', async () => {
    mockCookies.get.mockReturnValue(undefined)

    const PageComponent = await Page()

    render(PageComponent)

    expect(PageComponent).toBeUndefined()
  })

  it('does not render a location when the location cookie is not set', async () => {
    mockCookies.get.mockImplementation((name) => {
      if (name === 'id') {
        return { value: '123' }
      }
      if (name === 'token') {
        return { value: 'z123890' }
      }
      return undefined
    })

    const PageComponent = await Page()

    render(PageComponent)

    expect(screen.getByText('Summary Component')).toBeInTheDocument()
    expect(Summary).toHaveBeenCalledWith(
      {
        data: [
          {
            description: [mockMeldingData.text],
            key: 'primary',
            term: mockFormData.components[0].components[0].label,
          },
          ...mockAdditionalQuestionsAnswerData.map((item) => ({
            description: [item.text],
            key: item.question.id,
            term: item.question.text,
          })),
          {
            description: ['email@email.email', '0612345678'],
            key: 'contact',
            term: 'summary.contact-label',
          },
        ],
      },
      {},
    )
  })

  it('does not render contact data when that does not exist', async () => {
    mockCookies.get.mockImplementation((name) => {
      if (name === 'id') {
        return { value: '123' }
      }
      if (name === 'token') {
        return { value: 'z123890' }
      }
      if (name === 'location') {
        return {
          value: '{"name":"Test address"}',
        }
      }
      return undefined
    })

    server.use(
      http.get(ENDPOINTS.MELDING_BY_ID, () =>
        HttpResponse.json({
          ...mockMeldingData,
          email: null,
          phone: null,
        }),
      ),
    )

    const PageComponent = await Page()

    render(PageComponent)

    expect(screen.getByText('Summary Component')).toBeInTheDocument()
    expect(Summary).toHaveBeenCalledWith(
      {
        data: [
          {
            description: [mockMeldingData.text],
            key: 'primary',
            term: mockFormData.components[0].components[0].label,
          },
          ...mockAdditionalQuestionsAnswerData.map((item) => ({
            description: [item.text],
            key: item.question.id,
            term: item.question.text,
          })),
          {
            description: ['Test address'],
            key: 'location',
            term: 'location.title',
          },
        ],
      },
      {},
    )
  })
})
