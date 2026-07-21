'use client'

import type { AlertProps } from '@amsterdam/design-system-react'
import type { HTMLAttributes } from 'react'

import { Alert } from '@amsterdam/design-system-react/dist/Alert'
import { Paragraph } from '@amsterdam/design-system-react/dist/Paragraph'
import { clsx } from 'clsx'
import { useEffect, useRef } from 'react'

import styles from './ApiErrorAlert.module.css'

export type ApiErrorAlertProps = HTMLAttributes<HTMLDivElement> & {
  description: string
  heading: string
  headingLevel: AlertProps['headingLevel']
  // Pass !isPending from this alert's useActionState call. Refocuses whenever
  // this flips to true, i.e. whenever the server action has just settled.
  shouldRefocus: boolean
}

export const ApiErrorAlert = ({ className, description, heading, headingLevel, shouldRefocus }: ApiErrorAlertProps) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (shouldRefocus) ref.current?.focus()
  }, [shouldRefocus])

  return (
    <Alert
      className={clsx(styles.alert, className)}
      heading={heading}
      // Remove the default label for the Alert.
      // Otherwise, focusing on the Alert causes NVDA to read the label twice.
      headingId={null}
      headingLevel={headingLevel}
      ref={ref}
      severity="error"
      tabIndex={-1}
    >
      <Paragraph>{description}</Paragraph>
    </Alert>
  )
}
