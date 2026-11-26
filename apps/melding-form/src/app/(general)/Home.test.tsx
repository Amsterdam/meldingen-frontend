import type * as React from 'react'
import type { Mock } from 'vitest'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { delay, http, HttpResponse } from 'msw'
import { useActionState } from 'react'

import { Home } from './Home'
import { textAreaComponent } from '~/mocks/data'
import { server } from '~/mocks/node'

const { push } = vi.hoisted(() => ({ push: vi.fn() }))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}))

const mockQuestionText = /What is it about?/ // This is a regex to account for the label text being dynamic

const mockTextAreaComponent = {
  ...textAreaComponent,
  label: mockQuestionText.source, // This converts the regex to a string
}

const defaultProps = {
  formComponents: [mockTextAreaComponent],
}

vi.mock('react', async (importOriginal) => {
  const formData = new FormData()
  const actual = await importOriginal()

  return {
    ...(typeof actual === 'object' ? actual : {}),
    useActionState: vi.fn().mockReturnValue([{ formData, message: '' }, vi.fn(), false]),
  }
})

describe('Page', () => {
  it('renders the component with the correct document title', () => {
    render(<Home {...defaultProps} />)

    expect(document.title).toBe(`${mockQuestionText.source} - organisation-name`)
  })

  it('renders an error message and keeps input data', () => {
    const formData = new FormData()

    formData.append('textArea1', 'Er staan blowende jongeren')
    ;(useActionState as Mock).mockReturnValueOnce([{ apiError: 'Test error message', formData }, vi.fn(), false])

    const { container } = render(<Home {...defaultProps} />)

    const alert = container.querySelector('.ams-alert')

    expect(alert).toHaveTextContent('heading')

    const input = screen.getByRole('textbox')

    expect(input).toHaveValue('Er staan blowende jongeren')
  })

  it('renders an Invalid Form Alert when there are validation errors', () => {
    ;(useActionState as Mock).mockReturnValueOnce([
      { validationErrors: [{ key: 'key1', message: 'Test error message' }] },
      vi.fn(),
      false,
    ])

    render(<Home {...defaultProps} />)

    const link = screen.getByRole('link', { name: 'Test error message' })

    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '#key1')
  })

  it('renders a form', () => {
    render(<Home {...defaultProps} />)

    expect(screen.queryByRole('textbox', { name: mockQuestionText })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'submit-button' })).toBeInTheDocument()
    expect(screen.getByRole('textbox').closest('form')).toHaveAttribute('action', '/melding')
    expect(screen.getByRole('textbox').closest('form')).toHaveAttribute('method', 'post')
  })

  it('renders a default value in the input when provided', () => {
    render(
      <Home {...defaultProps} formComponents={[{ ...textAreaComponent, defaultValue: 'Default value from server' }]} />,
    )

    const input = screen.getByRole('textbox')

    expect(input).toHaveValue('Default value from server')
  })

  it('prioritizes form data returned by the action over the initial defaultValue', () => {
    const formData = new FormData()

    formData.append('textArea1', 'Form data from action')
    ;(useActionState as Mock).mockReturnValueOnce([{ formData }, vi.fn(), false])

    render(
      <Home {...defaultProps} formComponents={[{ ...textAreaComponent, defaultValue: 'Default value from server' }]} />,
    )

    const input = screen.getByRole('textbox')

    expect(input).toHaveValue('Form data from action')
  })

  it('updates the document title when there is an API error', () => {
    ;(useActionState as Mock).mockReturnValueOnce([{ apiError: 'Test error message' }, vi.fn(), false])

    render(<Home {...defaultProps} />)

    expect(document.title).toBe(`api-error-alert.heading - ${mockQuestionText.source} - organisation-name`)
  })

  it('updates the document title when there are validation errors', () => {
    ;(useActionState as Mock).mockReturnValueOnce([
      { validationErrors: [{ key: 'key1', message: 'Test error message' }] },
      vi.fn(),
      false,
    ])

    render(<Home {...defaultProps} />)

    expect(document.title).toBe(`document-title-error-count-prefix ${mockQuestionText.source} - organisation-name`)
  })

  describe('submission', () => {
    beforeEach(async () => {
      const actual = await vi.importActual<typeof React>('react')

      vi.mocked(useActionState).mockImplementation(actual.useActionState)
    })

    it('posts the entered text to /melding, shows a loading state, and navigates on success', async () => {
      const user = userEvent.setup()
      const submittedText = vi.fn()

      server.use(
        http.post('http://localhost:3000/melding', async ({ request }) => {
          // eslint-disable-next-line baseline-js/use-baseline -- This MSW handler runs in Node.js.
          submittedText((await request.formData()).get('textArea1'))
          await delay(750)

          return HttpResponse.json({ redirectUrl: '/locatie#top', type: 'success' })
        }),
      )

      render(<Home {...defaultProps} />)

      await user.type(screen.getByRole('textbox'), 'Er ligt afval op straat')
      await user.click(screen.getByRole('button', { name: 'submit-button' }))

      expect(await screen.findByRole('button', { name: 'submit-button, submit-button-loading-label' })).toHaveAttribute(
        'aria-disabled',
        'true',
      )
      await vi.waitFor(() => expect(push).toHaveBeenCalledWith('/locatie#top'))
      expect(submittedText).toHaveBeenCalledWith('Er ligt afval op straat')
    })

    it('keeps entered text and displays inline validation errors from the route', async () => {
      const user = userEvent.setup()

      server.use(
        http.post('http://localhost:3000/melding', () =>
          HttpResponse.json(
            {
              type: 'validation-error',
              validationErrors: [{ key: 'textArea1', message: 'Test validation error' }],
            },
            { status: 422 },
          ),
        ),
      )

      render(<Home {...defaultProps} />)

      await user.type(screen.getByRole('textbox'), 'Keep this text')
      await user.click(screen.getByRole('button', { name: 'submit-button' }))

      expect(await screen.findByRole('link', { name: 'Test validation error' })).toHaveAttribute('href', '#textArea1')
      expect(screen.getByRole('textbox')).toHaveValue('Keep this text')
      expect(push).not.toHaveBeenCalled()
      expect(document.title).toBe(`document-title-error-count-prefix ${mockQuestionText.source} - organisation-name`)
    })

    it.each(['api-error', 'network-error', 'invalid-response'])(
      'displays the API error alert and keeps entered text on %s',
      async (failure) => {
        const user = userEvent.setup()
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

        server.use(
          http.post('http://localhost:3000/melding', () => {
            if (failure === 'network-error') return HttpResponse.error()
            if (failure === 'invalid-response') return new HttpResponse('Unexpected response', { status: 500 })

            return HttpResponse.json({ apiError: 'Backend error', type: 'api-error' }, { status: 502 })
          }),
        )

        render(<Home {...defaultProps} />)

        await user.type(screen.getByRole('textbox'), 'Keep this text')
        await user.click(screen.getByRole('button', { name: 'submit-button' }))

        expect(await screen.findByRole('heading', { level: 2, name: 'heading' })).toBeInTheDocument()
        expect(screen.getByRole('textbox')).toHaveValue('Keep this text')
        expect(push).not.toHaveBeenCalled()
        expect(consoleError).toHaveBeenCalled()
        consoleError.mockRestore()
      },
    )
  })
})
