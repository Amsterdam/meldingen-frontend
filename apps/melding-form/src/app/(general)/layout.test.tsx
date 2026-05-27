import { render, screen } from '@testing-library/react'

import Layout from './layout'
import { COOKIES } from '~/constants'
import { mockCookies } from '~/mocks/utils'

vi.mock('next/headers', () => ({
  cookies: vi.fn().mockReturnValue({
    get: vi.fn(),
  }),
}))

describe('Layout', () => {
  it('renders the regular layout by default', async () => {
    const LayoutComponent = await Layout({ children: 'Test' })

    render(LayoutComponent)

    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Hoofdmenu' })).not.toBeInTheDocument()
  })

  it('renders the BackOfficeLayout when the source cookie is set to back-office', async () => {
    mockCookies({ [COOKIES.SOURCE]: 'back-office' })

    const LayoutComponent = await Layout({ children: 'Test' })

    render(LayoutComponent)

    expect(screen.getByRole('heading', { name: 'Hoofdmenu' })).toBeInTheDocument()
  })
})
