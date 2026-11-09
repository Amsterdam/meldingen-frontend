'use client'

import { useEffect } from 'react'

type Props = {
  title: string
}

export const ErrorDocumentTitle = ({ title }: Props) => {
  useEffect(() => {
    const originalTitle = document.title

    document.title = title

    return () => {
      if (document.title === title) {
        document.title = originalTitle
      }
    }
  }, [title])

  return null
}
