import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import * as mockRouter from 'next-router-mock'
import { vi } from 'vitest'

import { Home } from './Home'

const mockInput = 'This is test user input'
const mockQuestionText = /What is it about?/ // This is a regex to account for the label text being dynamic

const server = setupServer(
  http.get('http://localhost:8000/form/classification/123', () => new HttpResponse('Succesful response')),
  http.post('http://localhost:8000/melding', async ({ request }) => {
    const data = (await request.json()) as { text: string }

    // Check if request payload equals input. If not, throw an error.
    if (data?.text !== mockInput) {
      return new HttpResponse('Incorrect body text', { status: 400 })
    }

    return HttpResponse.json({ classification: '123' })
  }),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const mockFormData = [
  {
    type: 'textarea',
    key: 'what',
    label: mockQuestionText.source, // This converts the regex to a string
    description: '',
    input: true,
    inputType: 'text',
    showCharCount: false,
    position: 0,
  },
]

const { useRouter } = mockRouter

vi.mock('next/navigation', () => ({
  ...mockRouter,
  useSearchParams: () => {
    const router = useRouter()
    const path = router.query
    return new URLSearchParams(path as never)
  },
}))

describe('Page', () => {
  it('should render a form', async () => {
    render(<Home formData={mockFormData} />)

    await waitFor(() => {
      expect(screen.queryByRole('textbox', { name: mockQuestionText })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Volgende vraag' })).toBeInTheDocument()
    })
  })

  it('should send a filled form and navigate to /aanvullende-vragen', async () => {
    const user = userEvent.setup()

    render(<Home formData={mockFormData} />)

    const input = screen.getByRole('textbox', { name: mockQuestionText })

    await user.type(input, mockInput)

    const submit = screen.getByRole('button', { name: 'Volgende vraag' })

    await user.click(submit)

    await waitFor(() => {
      expect(mockRouter.default).toMatchObject({
        pathname: '/aanvullende-vragen/123/undefined',
      })
    })
  })
})
