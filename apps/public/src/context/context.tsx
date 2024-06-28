import { createContext, useContext } from 'react'

import type { AppContextType } from '../types/context'

export const AppContext = createContext<AppContextType | null>(null)

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext)

  if (context === null) {
    throw new Error(
      'Missing AppContext provider. You have to wrap the application with the AppContextProvider component.',
    )
  }

  return context
}
