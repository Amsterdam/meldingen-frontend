'use client'

import type { AlertProps } from '@amsterdam/design-system-react'

import { Alert } from '@amsterdam/design-system-react/dist/Alert'
import { Paragraph } from '@amsterdam/design-system-react/dist/Paragraph'
import { clsx } from 'clsx'
import { useEffect, useRef } from 'react'

import styles from './ApiErrorAlert.module.css'

export type ApiErrorAlertProps = {
  className?: string
  description: string
  heading: string
  headingLevel: AlertProps['headingLevel']
  /**
   * Pass a value that changes to `true` to trigger focus on the alert.
   * With `useActionState`, `!isPending` works well — it is `false` on submit and `true` when the response arrives.
   * Without `useActionState`, manage it yourself via a state variable: set it to `false` on submit and back to `true` on response.
   */
  shouldFocus: boolean
}

export const ApiErrorAlert = ({ className, description, heading, headingLevel, shouldFocus }: ApiErrorAlertProps) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (shouldFocus) ref.current?.focus()
  }, [shouldFocus])

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
