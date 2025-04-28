import { render, screen } from '@testing-library/react'
import { cookies } from 'next/headers'
import type { Mock } from 'vitest'

import Page from './page'
import { Summary } from './Summary'
import mockAdditionalQuestionsAnswerData from 'apps/public/src/mocks/mockAdditionalQuestionsAnswerData.json'
import mockFormData from 'apps/public/src/mocks/mockFormData.json'
import mockMeldingData from 'apps/public/src/mocks/mockMeldingData.json'

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
})
