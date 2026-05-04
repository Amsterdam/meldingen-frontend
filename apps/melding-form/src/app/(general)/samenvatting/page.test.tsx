import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'

import Page from './page'
import { Summary } from './Summary'
import { COOKIES, TOP_ANCHOR_ID } from '~/constants'
import { additionalQuestions, melding, textAreaComponent } from '~/mocks/data'
import { ENDPOINTS } from '~/mocks/endpoints'
import { server } from '~/mocks/node'
import { mockCookies, mockIdAndTokenCookies } from '~/mocks/utils'

vi.mock('next/headers', () => ({ cookies: vi.fn() }))

vi.mock('./Summary', () => ({
  Summary: vi.fn(() => <div>Summary Component</div>),
}))

describe('Page', () => {
  it('renders the Summary component', async () => {
    server.use(
      http.get(ENDPOINTS.GET_FORM_CLASSIFICATION_BY_CLASSIFICATION_ID, () =>
        HttpResponse.json({
          components: [
            {
              components: [{ question: 35 }, { question: 36 }],
              key: 'page1',
              type: 'panel',
            },
          ],
        }),
      ),
    )

    mockIdAndTokenCookies()

    const PageComponent = await Page()

    render(PageComponent)

    const additionalQuestionsSummary = additionalQuestions.map((item) => ({
      description: item.text,
      key: item.question.id.toString(),
      link: `/aanvullende-vragen/2/page1#${TOP_ANCHOR_ID}`,
      term: item.question.text,
    }))

    const attachments = {
      files: [
        expect.objectContaining({
          blob: expect.any(Blob),
          fileName: 'IMG_0815.jpg',
        }),
      ],
      key: 'attachments',
      term: 'attachments-label',
    }

    const contact = {
      description: [melding.email, melding.phone],
      key: 'contact',
      term: 'contact-label',
    }

    const primaryForm = {
      description: melding.text,
      key: 'primary',
      term: textAreaComponent.label,
    }

    expect(screen.getByText('Summary Component')).toBeInTheDocument()

    expect(Summary).toHaveBeenCalledWith(
      {
        action: expect.any(Function),
        additionalQuestions: additionalQuestionsSummary,
        attachments,
        contact: contact,
        location: {
          description: 'Oudezijds Voorburgwal 300A, 1012GL Amsterdam',
          key: 'location',
          term: 'location-label',
        },
        primaryForm: primaryForm,
        primaryFormLink: `/#${TOP_ANCHOR_ID}`,
      },
      undefined,
    )
  })

  it('returns an error message if no primary form is found', async () => {
    mockIdAndTokenCookies()

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

    await expect(Page()).rejects.toThrowError('Primary form id not found')
  })

  it('passes a link to the Back Office if the source cookie is set to back-office', async () => {
    vi.stubEnv('NEXT_PUBLIC_BACK_OFFICE_BASE_URL', 'https://backoffice.example.com')

    server.use(
      http.get(ENDPOINTS.GET_FORM_CLASSIFICATION_BY_CLASSIFICATION_ID, () =>
        HttpResponse.json({
          components: [
            {
              components: [{ question: 35 }, { question: 36 }],
              key: 'page1',
              type: 'panel',
            },
          ],
        }),
      ),
    )

    mockCookies({
      [COOKIES.ID]: '123',
      [COOKIES.SOURCE]: 'back-office',
      [COOKIES.TOKEN]: 'abc',
    })

    const PageComponent = await Page()

    render(PageComponent)

    expect(Summary).toHaveBeenCalledWith(
      expect.objectContaining({
        primaryFormLink: 'https://backoffice.example.com/melden?id=123&token=abc',
      }),
      undefined,
    )

    vi.unstubAllEnvs()
  })
})
