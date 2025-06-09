'use client'

import { Heading, Paragraph } from '@amsterdam/design-system-react'
import { useEffect } from 'react'

export default function Error({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    // TODO: Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <>
      <title>Er is iets mis gegaan - Gemeente Amsterdam</title>
      <Heading level={1} className="ams-mb-l">
        Er is iets mis gegaan
      </Heading>
      <Paragraph className="ams-mb-m" size="large">
        De pagina die u probeert te bezoeken heeft een storing.
      </Paragraph>
    </>
  )
}
