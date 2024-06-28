import { useMemo } from 'react'
import type { FC, ReactNode } from 'react'

import type { AppContextType } from '../types/context'

import { AppContext } from './context'

export const initialValue: AppContextType = {
  meldingInfo: null,
  setMeldingInfo: () => {},
}

interface Props {
  children: ReactNode
  value: AppContextType
}

export const AppContextProvider: FC<Props> = ({ value, children }) => {
  const memoizedValue = useMemo(() => value, [value])
  return <AppContext.Provider value={memoizedValue}>{children}</AppContext.Provider>
}
