import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'

import Page, { generateMetadata } from './page'
import { Summary } from './Summary'
import { additionalQuestions, melding, textAreaComponent } from 'apps/melding-form/src/mocks/data'
import { ENDPOINTS } from 'apps/melding-form/src/mocks/endpoints'
import { server } from 'apps/melding-form/src/mocks/node'
import { mockCookies, mockIdAndTokenCookies } from 'apps/melding-form/src/mocks/utils'

import { Blob } from 'buffer'

vi.mock('next/headers', () => ({ cookies: vi.fn() }))

vi.mock('./Summary', () => ({
  Summary: vi.fn(() => <div>Summary Component</div>),
}))

describe('generateMetadata', () => {
  it('returns the correct metadata title', async () => {
    const metadata = await generateMetadata()

    expect(metadata).toEqual({ title: 'metadata.title' })
  })
})

describe('Page', () => {
  it('renders the Summary component', async () => {
    server.use(
      http.get(ENDPOINTS.GET_FORM_CLASSIFICATION_BY_CLASSIFICATION_ID, () =>
        HttpResponse.json({
          components: [
            {
              key: 'page1',
              components: [{ question: 35 }, { question: 36 }],
            },
          ],
        }),
      ),
    )

    mockCookies({
      id: '123',
      token: 'test-token',
      location: JSON.stringify({ name: 'Test address' }),
    })

    const PageComponent = await Page()

    render(PageComponent)

    const additionalQuestionsSummary = additionalQuestions.map((item) => ({
      key: item.question.id.toString(),
      term: item.question.text,
      description: [item.text],
      link: '/aanvullende-vragen/2/page1',
    }))

    const attachments = {
      files: [
        expect.objectContaining({
          blob: expect.any(Blob),
          contentType: 'image/webp',
          fileName: 'IMG_0815.jpg',
        }),
      ],
      key: 'attachments',
      term: 'attachments-label',
    }

    const contact = {
      key: 'contact',
      term: 'contact-label',
      description: [melding.email, melding.phone],
    }

    const primaryForm = {
      key: 'primary',
      term: textAreaComponent.label,
      description: [melding.text],
    }

    expect(screen.getByText('Summary Component')).toBeInTheDocument()

    expect(Summary).toHaveBeenCalledWith(
      {
        additionalQuestions: additionalQuestionsSummary,
        attachments,
        contact: contact,
        location: {
          key: 'location',
          term: 'location-label',
          description: ['Test address'],
        },
        primaryForm: primaryForm,
      },
      {},
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
