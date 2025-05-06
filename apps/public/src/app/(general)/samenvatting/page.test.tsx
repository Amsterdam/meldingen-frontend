import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { cookies } from 'next/headers'
import type { Mock } from 'vitest'

import Page from './page'
import { Summary } from './Summary'
import { ENDPOINTS } from 'apps/public/src/mocks/endpoints'
import mockAdditionalQuestionsAnswerData from 'apps/public/src/mocks/mockAdditionalQuestionsAnswerData.json'
import mockFormData from 'apps/public/src/mocks/mockFormData.json'
import mockMeldingData from 'apps/public/src/mocks/mockMeldingData.json'
import { server } from 'apps/public/src/mocks/node'

import { Blob } from 'buffer'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(global as any).Blob = Blob

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

    const additionalQuestions = mockAdditionalQuestionsAnswerData.map((item) => ({
      key: item.question.id,
      term: item.question.text,
      description: [item.text],
    }))

    const attachments = {
      data: [
        expect.objectContaining({
          file: expect.any(Blob),
          meta: {
            contentType: 'image/webp',
            originalFilename: 'IMG_0815.jpg',
          },
        }),
      ],
      key: 'attachments',
      term: 'attachments.step.title',
    }

    const contact = {
      key: 'contact',
      term: 'summary.contact-label',
      description: [mockMeldingData.email, mockMeldingData.phone],
    }

    const primaryForm = {
      key: 'primary',
      term: mockFormData.components[0].components[0].label,
      description: [mockMeldingData.text],
    }

    expect(screen.getByText('Summary Component')).toBeInTheDocument()

    expect(Summary).toHaveBeenCalledWith(
      {
        additionalQuestions: additionalQuestions,
        attachments,
        contact: contact,
        location: {
          key: 'location',
          term: 'location.title',
          description: ['Test address'],
        },
        primaryForm: primaryForm,
      },
      {},
    )
  })

  it('returns an error message if no primary form is found', async () => {
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

    expect(PageComponent).toEqual('Primary form id not found')
  })

  it('returns an error message when there is no meldingId and token', async () => {
    mockCookies.get.mockReturnValue(undefined)

    const PageComponent = await Page()

    render(PageComponent)

    expect(PageComponent).toEqual('Could not retrieve meldingId or token')
  })
})
