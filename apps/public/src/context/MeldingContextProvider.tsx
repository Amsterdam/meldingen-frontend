'use client'

import { createContext, useContext, useMemo, useState } from 'react'
import type { FC, PropsWithChildren } from 'react'

export interface Data {
  id: number
  token: string
  classification: number | null | undefined
}

interface MeldingContextType {
  data: Data | null
  setData: (data: Data) => void
}

export const initialValue: MeldingContextType = {
  data: null,
  setData: () => {},
}

const MeldingContext = createContext<MeldingContextType>(initialValue)

export const useMeldingContext = (): MeldingContextType => {
  const context = useContext(MeldingContext)

  if (context === null) {
    throw new Error(
      'Missing AppContext provider. You have to wrap the application with the AppContextProvider component.',
    )
  }

  return context
}

export const MeldingContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [data, setData] = useState<Data | null>(null)

  const value = useMemo(() => ({ data, setData }), [data])

  return <MeldingContext.Provider value={value}>{children}</MeldingContext.Provider>
}
