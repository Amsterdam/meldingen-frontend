import type * as ReactAdminModule from 'react-admin'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Admin } from './Admin'
import * as authOptionsModule from './providers/entraAuthProvider'

vi.mock('react-admin', async (importOriginal) => {
  const original = await importOriginal<typeof ReactAdminModule>()
  const { Link, useLocation } = await import('react-router-dom')

  return {
    ...original,
    Admin: () => {
      const { pathname } = useLocation()

      return (
        <>
          <output aria-label="Current path">{pathname}</output>
          <Link to="/form">Forms</Link>
        </>
      )
    },
  }
})

describe('Admin', () => {
  afterEach(() => {
    vi.unstubAllEnvs()

    window.history.replaceState(null, '', '/')
  })

  it('should render successfully', () => {
    const { baseElement } = render(<Admin />)

    expect(baseElement).toBeTruthy()
  })

  it('should render successfully when isEntraAuthEnabled is false', () => {
    vi.spyOn(authOptionsModule, 'isEntraAuthEnabled', 'get').mockReturnValue(false)

    render(<Admin />)
  })

  it.each(['/', '/admin/', '/nested/admin/'])('supports navigation under base path %s', async (basePath) => {
    vi.stubEnv('BASE_URL', basePath)

    window.history.replaceState(null, '', `${basePath}classification`)

    const user = userEvent.setup()

    render(<Admin />)

    expect(screen.getByLabelText('Current path')).toHaveTextContent('/classification')
    expect(screen.getByRole('link', { name: 'Forms' })).toHaveAttribute('href', `${basePath}form`)

    await user.click(screen.getByRole('link', { name: 'Forms' }))

    expect(window.location.pathname).toBe(`${basePath}form`)
    expect(screen.getByLabelText('Current path')).toHaveTextContent('/form')
  })
})
