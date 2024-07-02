'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'

import type { Data } from '../context/meldingContext'
import { MeldingProvider } from '../context/meldingContext'

export const Providers = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<Data | null>(null)

  return <MeldingProvider value={{ data, setData }}>{children}</MeldingProvider>
}
