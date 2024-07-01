import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import React from 'react'

import { AppRouterContextProviderMock } from '../mocks/app-router-context-provider-mock'

import Page from './page'
import { Providers } from './providers'

const mockInput = 'This is a test input'

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
          label: 'Waar gaat het om?',
          input: true,
          inputType: 'text',
          showCharCount: false,
          position: 0,
        },
      ],
    }),
}))

const push = jest.fn()
const renderCompponent = () => {
  render(
    <Providers>
      <AppRouterContextProviderMock router={{ push }}>
        <Page />
      </AppRouterContextProviderMock>
    </Providers>,
  )
}

describe('Page', () => {
  it('should render a form', async () => {
    renderCompponent()

    await waitFor(() => {})

    expect(screen.getByRole('textbox', { name: 'Waar gaat het om?' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
  })

  it('should send a filled form', async () => {
    renderCompponent()

    await waitFor(() => {})

    const input = screen.getByRole('textbox', { name: 'Waar gaat het om?' })

    act(() => {
      // @ts-expect-error value does exist
      input.value = mockInput
      const event = new Event('input', { bubbles: true, cancelable: true })
      input.dispatchEvent(event)
    })

    expect(input).toHaveValue(mockInput)

    const submit = screen.getByRole('button', { name: 'Submit' })

    act(() => {
      fireEvent.click(submit)
    })

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/aanvullende-vragen')
    })
  })
})
