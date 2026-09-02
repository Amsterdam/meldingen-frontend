'use client'

import type { PropsWithChildren } from 'react'

import { createContext, useContext, useState } from 'react'

type RemoveAttachmentErrorContextValue = {
  apiError: string | null
  setApiError: (error: string | null) => void
}

const RemoveAttachmentErrorContext = createContext<RemoveAttachmentErrorContextValue | undefined>(undefined)

export const RemoveAttachmentErrorProvider = ({ children }: PropsWithChildren) => {
  const [apiError, setApiError] = useState<string | null>(null)

  return (
    <RemoveAttachmentErrorContext.Provider value={{ apiError, setApiError }}>
      {children}
    </RemoveAttachmentErrorContext.Provider>
  )
}

export const useRemoveAttachmentError = () => {
  const context = useContext(RemoveAttachmentErrorContext)

  if (!context) {
    throw new Error('useRemoveAttachmentError must be used within RemoveAttachmentErrorProvider')
  }

  return context
}
