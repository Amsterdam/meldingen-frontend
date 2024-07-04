import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { AppRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import type { ReactNode } from 'react'

export type NextRouterContextProviderMockProps = {
  router: Partial<AppRouterInstance>
  children: ReactNode
}

export const NextRouterContextProviderMock = ({ router, children }: NextRouterContextProviderMockProps): ReactNode => {
  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const mockedRouter: AppRouterInstance = {
    back: jest.fn(),
    forward: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
    ...router,
  }
  return <AppRouterContext.Provider value={mockedRouter}>{children}</AppRouterContext.Provider>
}
