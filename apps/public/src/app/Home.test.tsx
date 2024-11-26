import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { vi } from 'vitest'

import { MeldingContextProvider } from '../context/MeldingContextProvider'
import { NextRouterContextProviderMock } from '../mocks/NextRouterContextProviderMock'

import { Home } from './Home'

const mockInput = 'This is test user input'
const mockQuestionText = 'What is it about?'

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

const mockFormData = {
  title: 'Hoofdformulier',
  display: 'form',
  created_at: '2024-07-15T14:00:56.112771',
  updated_at: '2024-07-15T14:00:56.112771',
  type: 'primary',
  components: [
    {
      type: 'textarea',
      key: 'what',
      label: mockQuestionText,
      input: true,
      inputType: 'text',
      showCharCount: false,
      position: 0,
    },
    { type: 'button', key: 'submit', label: 'Submit', input: false },
  ],
}

const push = vi.fn()
const renderPage = () => {
  render(
    <MeldingContextProvider>
      <NextRouterContextProviderMock router={{ push }}>
        <Home formData={mockFormData} />
      </NextRouterContextProviderMock>
    </MeldingContextProvider>,
  )
}

describe('Page', () => {
  it.skip('should render a form', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.queryByRole('textbox', { name: mockQuestionText })).toBeInTheDocument()
      expect(screen.queryByRole('button')).toBeInTheDocument()
    })
  })

  it.skip('should send a filled form and navigate to /aanvullende-vragen', async () => {
    renderPage()

    const input = screen.getByRole('textbox', { name: mockQuestionText })

    act(() => {
      // TODO: try to find a more realistic way to input a value in FormIO
      // @ts-expect-error value does exist
      input.value = mockInput
      const event = new Event('input', { bubbles: true, cancelable: true })
      input.dispatchEvent(event)
    })

    const submit = screen.getByRole('button', { name: 'Submit' })

    fireEvent.click(submit)

    await waitFor(
      () => {
        expect(push).toHaveBeenCalledWith('/aanvullende-vragen')
      },
      { timeout: 4000 },
    )
  })

  it.skip('should set context with the right values', () => {})
})
