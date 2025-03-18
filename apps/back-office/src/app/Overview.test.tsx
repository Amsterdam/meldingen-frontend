import { render, screen } from '@testing-library/react'
import { SessionProvider, signIn, useSession } from 'next-auth/react'
import type { ReactNode } from 'react'
import type { Mock } from 'vitest'

import { Overview } from './Overview'

vi.mock('next-auth/react', () => ({
  useSession: vi.fn(),
  signIn: vi.fn(),
  SessionProvider: ({ children }: { children: ReactNode }) => <SessionProvider>{children}</SessionProvider>,
}))

const mockSession = {
  data: {
    user: {},
    expires: '2025-04-17T12:24:18.193Z',
    accessToken: 'eyJhbGciOiJSU',
  },
  status: 'authenticated',
}

describe('Overview', () => {
  it('should render correctly', () => {
    ;(useSession as Mock).mockReturnValue(mockSession)

    render(<Overview />)

    expect(screen.getByText('Back Office')).toBeInTheDocument()
  })

  it('should call signIn when refresh access token gives an error', () => {
    ;(useSession as Mock).mockReturnValue({ data: { error: 'RefreshAccessTokenError' }, status: 'unauthenticated' })

    render(<Overview />)

    screen.debug()
    expect(signIn).toBeCalledTimes(1)
  })
})
