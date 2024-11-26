import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { AppRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import type { ReactNode } from 'react'
import { vi } from 'vitest'

export type NextRouterContextProviderMockProps = {
  router: Partial<AppRouterInstance>
  children: ReactNode
}

export const NextRouterContextProviderMock = ({ router, children }: NextRouterContextProviderMockProps): ReactNode => {
  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const mockedRouter: AppRouterInstance = {
    back: vi.fn(),
    forward: vi.fn(),
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
    ...router,
  }
  return <AppRouterContext.Provider value={mockedRouter}>{children}</AppRouterContext.Provider>
}
