import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { cookies } from 'next/headers'
import type { Mock } from 'vitest'

import Page, { generateMetadata } from './page'
import { Summary } from './Summary'
import { additionalQuestions, melding, textAreaComponent } from 'apps/melding-form/src/mocks/data'
import { ENDPOINTS } from 'apps/melding-form/src/mocks/endpoints'
import { server } from 'apps/melding-form/src/mocks/node'

import { Blob } from 'buffer'

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

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
  const mockCookies = {
    get: vi.fn(),
  }

  beforeEach(() => {
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

    const additionalQuestionsSummary = additionalQuestions.map((item) => ({
      key: item.question.id.toString(),
      term: item.question.text,
      description: [item.text],
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
