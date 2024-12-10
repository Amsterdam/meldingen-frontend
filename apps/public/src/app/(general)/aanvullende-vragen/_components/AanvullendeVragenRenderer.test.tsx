import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import * as mockRouter from 'next-router-mock'
import { vi } from 'vitest'

import mockFormData from 'apps/public/src/mocks/mockFormData.json'

import { AanvullendeVragenRenderer } from './AanvullendeVragenRenderer'

const { useRouter } = mockRouter

vi.mock('next/navigation', () => ({
  ...mockRouter,
  useSearchParams: () => {
    const router = useRouter()
    const path = router.query
    return new URLSearchParams(path as never)
  },
}))

const mockInput = 'This is test user input'

const server = setupServer(
  http.post('http://localhost:8000/melding/456/question/1', async ({ request }) => {
    const data = (await request.json()) as { text: string }

    // Check if request payload equals input. If not, throw an error.
    if (data?.text !== mockInput) {
      return new HttpResponse('Incorrect body text', { status: 400 })
    }

    return new HttpResponse()
  }),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('AanvullendeVragenRenderer', () => {
  it('renders a back link', () => {
    render(
      <AanvullendeVragenRenderer
        formData={mockFormData.components[0].components}
        nextPanelPath="/next"
        previousPanelPath="/previous"
      />,
    )

    const backlink = screen.getByRole('link', { name: 'Vorige vraag' })

    expect(backlink).toBeInTheDocument()
  })

  it('renders a back link with the correct url params', () => {
    mockRouter.default.push('/?token=123&id=456')

    render(
      <AanvullendeVragenRenderer
        formData={mockFormData.components[0].components}
        nextPanelPath="/next"
        previousPanelPath="/previous"
      />,
    )

    const backlink = screen.getByRole('link', { name: 'Vorige vraag' })

    expect(backlink).toHaveAttribute('href', '/previous?token=123&id=456')
  })

  it('navigates to the primary form when the back link is clicked on the first page', async () => {
    mockRouter.default.push('/?token=123&id=456')

    const user = userEvent.setup()

    render(
      <AanvullendeVragenRenderer
        formData={mockFormData.components[0].components}
        nextPanelPath="/next"
        previousPanelPath="/previous"
      />,
    )

    const backlink = screen.getByRole('link', { name: 'Vorige vraag' })

    await user.click(backlink)

    await waitFor(() => {
      expect(mockRouter.default).toMatchObject({
        asPath: '/?token=123&id=456',
      })
    })
  })

  it('navigates to the next panel when the form is submitted', async () => {
    mockRouter.default.push('/?token=123&id=456')

    const user = userEvent.setup()

    render(
      <AanvullendeVragenRenderer
        formData={mockFormData.components[0].components}
        nextPanelPath="/next"
        previousPanelPath="/previous"
      />,
    )

    const submitButton = screen.getByRole('button', { name: 'Volgende vraag' })

    await user.click(submitButton)

    await waitFor(() => {
      expect(mockRouter.default).toMatchObject({
        asPath: '/next?token=123&id=456',
      })
    })
  })

  it('posts the answer', async () => {
    // This is tested in the MSW server setup

    mockRouter.default.push('/?token=123&id=456')

    const user = userEvent.setup()

    render(
      <AanvullendeVragenRenderer
        formData={mockFormData.components[0].components}
        nextPanelPath="/next"
        previousPanelPath="/previous"
      />,
    )

    const question = screen.getByRole('textbox', { name: /First question/ })

    await user.type(question, mockInput)

    const submitButton = screen.getByRole('button', { name: 'Volgende vraag' })

    await user.click(submitButton)
  })

  it('renders a heading', () => {
    render(
      <AanvullendeVragenRenderer
        formData={mockFormData.components[0].components}
        nextPanelPath="/next"
        previousPanelPath="/previous"
      />,
    )

    const heading = screen.getByRole('heading', { name: 'Beschrijf uw melding' })

    expect(heading).toBeInTheDocument()
  })

  it('renders form data', () => {
    render(
      <AanvullendeVragenRenderer
        formData={mockFormData.components[0].components}
        nextPanelPath="/next"
        previousPanelPath="/previous"
      />,
    )

    const question = screen.getByRole('textbox', { name: /First question/ })

    expect(question).toBeInTheDocument()
  })
})
