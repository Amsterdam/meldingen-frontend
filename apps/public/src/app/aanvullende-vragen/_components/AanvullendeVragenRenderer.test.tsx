import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import mockFormData from 'apps/public/src/mocks/mockFormData.json'
import { NextRouterContextProviderMock } from 'apps/public/src/mocks/NextRouterContextProviderMock'

import { AanvullendeVragenRenderer } from './AanvullendeVragenRenderer'

const renderPage = () => {
  const push = vi.fn()

  render(
    <NextRouterContextProviderMock router={{ push }}>
      <AanvullendeVragenRenderer
        formData={mockFormData.components[0].components}
        nextPanelPath="/next"
        previousPanelPath="/previous"
      />
    </NextRouterContextProviderMock>,
  )
}

describe('AanvullendeVragenRenderer', () => {
  it('renders a back link', () => {
    renderPage()

    const backlink = screen.getByRole('link', { name: 'Vorige vraag' })

    expect(backlink).toBeInTheDocument()
  })

  // it('renders a back link with the correct url params', () => {
  //   renderPage()

  //   const backlink = screen.getByRole('link', { name: 'Vorige vraag' })

  //   expect(backlink).toHaveAttribute('href', '/previous?id=123')
  // })

  // it('navigates to the previous panel when the back link is clicked', () => {
  //   renderPage()

  //   const backlink = screen.getByRole('link', { name: 'Vorige vraag' })
  //   fireEvent.click(backlink)

  //   const mockRouter = useRouter()
  //   expect(mockRouter.push).toHaveBeenCalledWith('/previous?id=123')
  // })

  // it('navigates to the next panel when the form is submitted', () => {
  //   renderPage()

  //   const submitButton = screen.getByRole('button', { name: 'Volgende vraag' })
  //   fireEvent.click(submitButton)

  //   const mockRouter = useRouter()
  //   expect(mockRouter.push).toHaveBeenCalledWith('/next?id=123')
  // })

  it('renders a heading', () => {
    renderPage()

    const heading = screen.getByRole('heading', { name: 'Beschrijf uw melding' })

    expect(heading).toBeInTheDocument()
  })

  it('renders form data', () => {
    renderPage()

    const question = screen.getByRole('textbox', { name: /First question/ })

    expect(question).toBeInTheDocument()
  })
})
