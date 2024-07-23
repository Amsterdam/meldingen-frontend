import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

import { MeldingContext } from '../../context/MeldingContextProvider'
import mockFormData from '../../mocks/mockFormData.json'
import { NextRouterContextProviderMock } from '../../mocks/NextRouterContextProviderMock'

import Page from './page'

const mockFirstQuestionText = 'First question'
const mockSecondQuestionText = 'Second question'
const mockInput = 'This is test user input'
const mockContextValue = {
  data: {
    id: 2,
    token: 'test',
    classification: 1,
  },
  setData: () => {},
}

const server = setupServer(
  http.get('http://localhost:8000/form/classification/1', () => HttpResponse.json(mockFormData)),
  http.post('http://localhost:8000/melding/2/question/1', () => new HttpResponse()),
  http.put('http://localhost:8000/melding/2/answer_questions', () => new HttpResponse()),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const push = jest.fn()
const renderPage = () => {
  render(
    <MeldingContext.Provider value={mockContextValue}>
      <NextRouterContextProviderMock router={{ push }}>
        <Page />
      </NextRouterContextProviderMock>
    </MeldingContext.Provider>,
  )
}

describe('AanvullendeVragen', () => {
  it('should render a form', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: mockFirstQuestionText })).toBeInTheDocument()
    })
  })

  it('should render a submit button', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Volgende vraag' })).toBeInTheDocument()
    })
  })

  it('should render a back link', async () => {
    renderPage()

    expect(screen.getByRole('link', { name: 'Vorige vraag' })).toBeInTheDocument()
  })

  it('should navigate to home page after click on back link on first page', async () => {
    const user = userEvent.setup()

    renderPage()

    const backLink = screen.getByRole('link', { name: 'Vorige vraag' })

    await user.click(backLink)

    expect(push).toHaveBeenCalledWith('/', { scroll: true })
  })

  it('should navigate to second page after click on submit button on first page', async () => {
    const user = userEvent.setup()

    renderPage()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Volgende vraag' })).toBeInTheDocument()
    })

    const submitButton = screen.getByRole('button', { name: 'Volgende vraag' })

    await user.click(submitButton)

    expect(screen.getByRole('textbox', { name: mockSecondQuestionText })).toBeInTheDocument()
  })

  it('should navigate to first page after click on back link on second page', async () => {
    const user = userEvent.setup()

    renderPage()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Volgende vraag' })).toBeInTheDocument()
    })

    const submitButton = screen.getByRole('button', { name: 'Volgende vraag' })

    await user.click(submitButton)

    expect(screen.getByRole('textbox', { name: mockSecondQuestionText })).toBeInTheDocument()

    const backLink = screen.getByRole('link', { name: 'Vorige vraag' })

    await user.click(backLink)

    expect(screen.getByRole('textbox', { name: mockFirstQuestionText })).toBeInTheDocument()
  })

  it.skip('should fall back on the default form when melding is not classified', () => {})

  it('submits answer to first question', async () => {
    server.use(
      http.post('http://localhost:8000/melding/2/question/1', async ({ request }) => {
        const data = (await request.json()) as { text: string }

        // Check if request payload equals input. If not, throw an error.
        if (data?.text !== mockInput) {
          return new HttpResponse('Incorrect body text', { status: 400 })
        }

        return new HttpResponse('Succesful response')
      }),
    )

    const user = userEvent.setup()

    renderPage()

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: mockFirstQuestionText })).toBeInTheDocument()
    })

    const input = screen.getByRole('textbox', { name: mockFirstQuestionText })

    await user.type(input, mockInput)

    const nextButton = screen.getByRole('button', { name: 'Volgende vraag' })

    await user.click(nextButton)
  })

  it('submits answer to last question', async () => {
    server.use(
      http.post('http://localhost:8000/melding/2/question/2', async ({ request }) => {
        const data = (await request.json()) as { text: string }
        // Check if request payload equals input. If not, throw an error.
        if (data?.text !== mockInput) {
          return new HttpResponse('Incorrect body text', { status: 400 })
        }
        return new HttpResponse('Succesful response')
      }),
    )

    const user = userEvent.setup()

    renderPage()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Volgende vraag' })).toBeInTheDocument()
    })

    const nextButton = screen.getByRole('button', { name: 'Volgende vraag' })

    await user.click(nextButton)

    expect(screen.getByRole('textbox', { name: mockSecondQuestionText })).toBeInTheDocument()

    const input = screen.getByRole('textbox', { name: mockSecondQuestionText })

    await user.type(input, mockInput)

    const submitButton = screen.getByRole('button', { name: 'Volgende vraag' })

    await user.click(submitButton)

    expect(push).toHaveBeenCalledWith('/bedankt')
  })
})
