'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'

import { AppContextProvider } from '../context/provider'
import type { MeldingInfo } from '../types/context'

export const Providers = ({ children }: { children: ReactNode }) => {
  const [meldingInfo, setMeldingInfo] = useState<MeldingInfo | null>(null)

  return <AppContextProvider value={{ meldingInfo, setMeldingInfo }}>{children}</AppContextProvider>
}
