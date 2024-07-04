import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

import { NextRouterContextProviderMock } from '../../mocks/NextRouterContextProviderMock'

import Page from './page'

const push = jest.fn()
const renderPage = () => {
  render(
    <NextRouterContextProviderMock router={{ push }}>
      <Page />
    </NextRouterContextProviderMock>,
  )
}

describe('Aanvullende vragen page', () => {
  it('should render a form', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: 'Waar is het?' })).toBeInTheDocument()
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
    renderPage()

    const backLink = screen.getByRole('link', { name: 'Vorige vraag' })

    act(() => {
      fireEvent.click(backLink)
    })

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/', { scroll: true })
    })
  })

  it('should navigate to second page after click on submit button on first page', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Volgende vraag' })).toBeInTheDocument()
    })

    const submitButton = screen.getByRole('button', { name: 'Volgende vraag' })

    act(() => {
      fireEvent.click(submitButton)
    })

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: 'Wanneer was het?' })).toBeInTheDocument()
    })
  })

  it('should navigate to first page after click on back link on second page', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Volgende vraag' })).toBeInTheDocument()
    })

    const submitButton = screen.getByRole('button', { name: 'Volgende vraag' })

    act(() => {
      fireEvent.click(submitButton)
    })

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: 'Wanneer was het?' })).toBeInTheDocument()
    })

    const backLink = screen.getByRole('link', { name: 'Vorige vraag' })

    act(() => {
      fireEvent.click(backLink)
    })

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: 'Waar is het?' })).toBeInTheDocument()
    })
  })
})
