import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

import { MeldingContextProvider } from '../context/MeldingContextProvider'
import { NextRouterContextProviderMock } from '../mocks/NextRouterContextProviderMock'

import Page from './page'

const mockInput = 'This is a test input'
const mockLabel = 'Waar gaat het om?'

jest.mock('@meldingen/api-client', () => ({
  __esModule: true,
  ...jest.requireActual('@meldingen/api-client'),
  postMelding: () =>
    Promise.resolve({
      id: 35,
      created_at: '2024-07-01T08:54:59.731119',
      updated_at: '2024-07-01T08:54:59.884144',
      text: mockInput,
      state: 'new',
      classification: null,
      token: 'qHaOTJy4j_wwIw_pHT1xqTEmpUO3tHkQYLXtLC6Gp58',
    }),
  getStaticFormByFormType: () =>
    Promise.resolve({
      id: 1,
      created_at: '2024-07-01T08:54:59.731119',
      updated_at: '2024-07-01T08:54:59.884144',
      formType: 'primary',
      components: [
        {
          type: 'textarea',
          key: 'waar-gaat-het-om',
          label: mockLabel,
          input: true,
          inputType: 'text',
          showCharCount: false,
          position: 0,
        },
      ],
    }),
}))

const push = jest.fn()
const renderComponent = () => {
  render(
    <MeldingContextProvider>
      <NextRouterContextProviderMock router={{ push }}>
        <Page />
      </NextRouterContextProviderMock>
    </MeldingContextProvider>,
  )
}

describe('Page', () => {
  it('should render a form', async () => {
    renderComponent()

    await waitFor(
      () => {
        expect(screen.getByRole('textbox', { name: mockLabel })).toBeInTheDocument()
        expect(screen.getByRole('button')).toBeInTheDocument()
      },
      { timeout: 2000 },
    )
  })

  it('should send a filled form', async () => {
    renderComponent()

    await waitFor(() => {
      screen.getByRole('textbox', { name: 'Waar gaat het om?' })
    })

    const input = screen.getByRole('textbox', { name: 'Waar gaat het om?' })

    act(() => {
      // TODO: try to find a more realistic way to input a value in FormIO
      // @ts-expect-error value does exist
      input.value = mockInput
      const event = new Event('input', { bubbles: true, cancelable: true })
      input.dispatchEvent(event)
    })

    const submit = screen.getByRole('button', { name: 'Submit' })

    fireEvent.click(submit)

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/aanvullende-vragen')
    })
  })
})
