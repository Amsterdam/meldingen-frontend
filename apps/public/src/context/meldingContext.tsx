import { createContext, useContext } from 'react'
import type { FC, ReactNode } from 'react'

export interface Data {
  id: number
  token: string
  classification: number | null | undefined
}

interface MeldingContextType {
  data: Data | null
  setData: (meldingInfo: Data) => void
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
interface Props {
  children: ReactNode
  value: MeldingContextType
}

export const MeldingProvider: FC<Props> = ({ value, children }) => (
  <MeldingContext.Provider value={value}>{children}</MeldingContext.Provider>
)
