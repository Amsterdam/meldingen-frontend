import { render, screen } from '@testing-library/react'
import { Fragment, PropsWithChildren } from 'react'

import RootLayout, { generateMetadata } from './layout'

vi.mock('next-intl', () => ({
  NextIntlClientProvider: ({ children }: PropsWithChildren) => <Fragment>{children}</Fragment>,
}))

vi.mock('next-intl/server', () => ({
  getLocale: vi.fn(),
  getTranslations: () => Promise.resolve((key: string) => key),
}))

// We have to mock matchMedia here, because it is used in the Amsterdam Design System Header component
// We do not really use the matchMedia functionality, so we use a simple mock.
Object.defineProperty(window, 'matchMedia', {
  value: vi.fn().mockImplementation(() => ({})),
})

describe('generateMetadata', () => {
  it('returns the correct metadata description', async () => {
    const metadata = await generateMetadata()

    expect(metadata).toEqual({ description: 'description' })
  })
})

describe('RootLayout', () => {
  it('renders a Menu with Menu.Links', async () => {
    render(await RootLayout({ children: <p>Test</p> }))

    const menuLinks = screen.getAllByRole('link', { name: 'menu.overview' })

    expect(menuLinks[0]).toBeInTheDocument()
    expect(menuLinks[1]).toBeInTheDocument()
  })
})
