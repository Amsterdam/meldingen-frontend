import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'

import Page from './page'
import { Summary } from './Summary'
import { additionalQuestions, melding, textAreaComponent } from 'apps/melding-form/src/mocks/data'
import { ENDPOINTS } from 'apps/melding-form/src/mocks/endpoints'
import { server } from 'apps/melding-form/src/mocks/node'
import { mockIdAndTokenCookies } from 'apps/melding-form/src/mocks/utils'

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
      link: '/aanvullende-vragen/2/page1',
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
        additionalQuestions: additionalQuestionsSummary,
        attachments,
        contact: contact,
        location: {
          description: 'Oudezijds Voorburgwal 300A, 1012GL Amsterdam',
          key: 'location',
          term: 'location-label',
        },
        primaryForm: primaryForm,
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
})
