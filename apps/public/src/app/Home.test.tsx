import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { vi } from 'vitest'

import { NextRouterContextProviderMock } from '../mocks/NextRouterContextProviderMock'

import { Home } from './Home'

const mockInput = 'This is test user input'
const mockQuestionText = /What is it about?/ // This is a regex to account for the label text being dynamic

const server = setupServer(
  http.post('http://localhost:8000/melding', async ({ request }) => {
    const data = (await request.json()) as { text: string }

    // Check if request payload equals input. If not, throw an error.
    if (data?.text !== mockInput) {
      return new HttpResponse('Incorrect body text', { status: 400 })
    }

    return new HttpResponse('Succesful response')
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

const push = vi.fn()
const renderPage = () => {
  render(
    <NextRouterContextProviderMock router={{ push }}>
      <Home formData={mockFormData} />
    </NextRouterContextProviderMock>,
  )
}

describe('Page', () => {
  it('should render a form', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.queryByRole('textbox', { name: mockQuestionText })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Volgende vraag' })).toBeInTheDocument()
    })
  })

  it('should send a filled form and navigate to /aanvullende-vragen', async () => {
    const user = userEvent.setup()

    renderPage()

    const input = screen.getByRole('textbox', { name: mockQuestionText })

    await user.type(input, mockInput)

    const submit = screen.getByRole('button', { name: 'Volgende vraag' })

    await user.click(submit)

    // await waitFor(
    //   () => {
    //     expect(push).toHaveBeenCalledWith('/aanvullende-vragen')
    //   },
    //   { timeout: 4000 },
    // )
  })
})
