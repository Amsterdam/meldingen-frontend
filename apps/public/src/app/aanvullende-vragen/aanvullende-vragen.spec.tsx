import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

import { AppRouterContextProviderMock } from '../../mocks/app-router-context-provider-mock'

import Page from './page'

describe('Aanvullende vragen page', () => {
  it('should render a form', async () => {
    render(<Page />)

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: 'Waar is het?' })).toBeInTheDocument()
    })
  })

  it('should render a submit button', async () => {
    render(<Page />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Volgende vraag' })).toBeInTheDocument()
    })
  })

  it('should render a back link', async () => {
    render(<Page />)

    expect(screen.getByRole('link', { name: 'Vorige vraag' })).toBeInTheDocument()
  })

  it('should navigate to home page after click on back link on first page', async () => {
    const push = jest.fn()
    render(
      <AppRouterContextProviderMock router={{ push }}>
        <Page />
      </AppRouterContextProviderMock>,
    )

    const backLink = screen.getByRole('link', { name: 'Vorige vraag' })

    act(() => {
      fireEvent.click(backLink)
    })

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/', { scroll: true })
    })
  })

  it('should navigate to second page after click on submit button on first page', async () => {
    render(<Page />)

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
    render(<Page />)

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
