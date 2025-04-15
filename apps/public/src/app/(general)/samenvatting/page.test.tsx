import { render, screen } from '@testing-library/react'
import { cookies } from 'next/headers'
import type { Mock } from 'vitest'

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
        additionalQuestionsAnswers: [
          { key: '35', term: 'Wat wilt u melden?', description: ['q1'] },
          { key: '36', term: 'Text Field', description: ['q2'] },
        ],
        attachments: {
          key: 'attachments',
          term: 'summary.attachments-label',
          data: [
            {
              file: [{}],
              meta: {
                id: 42,
                created_at: '2025-04-14T18:54:13.496644',
                updated_at: '2025-04-14T18:54:14.116304',
                original_filename: 'IMG_0815.jpg',
              },
            },
          ],
        },
        contact: {
          key: 'contact',
          term: 'summary.contact-label',
          description: ['email@email.email', '0612345678'],
        },
        location: {
          key: 'location',
          term: 'location.title',
          description: ['Test address'],
        },
        melding: { key: 'primary', term: 'First question', description: ['Alles'] },
      },
      {},
    )
  })
})
