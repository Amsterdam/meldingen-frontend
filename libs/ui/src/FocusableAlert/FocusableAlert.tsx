'use client'

import type { AlertProps as ADSAlertProps } from '@amsterdam/design-system-react'
import type { ReactNode } from 'react'

import { Alert as ADSAlert, Paragraph } from '@amsterdam/design-system-react'
import { clsx } from 'clsx'
import { useEffect, useRef } from 'react'

import styles from './FocusableAlert.module.css'

type AlertContentProps =
  | {
      children: ReactNode
      description?: never
    }
  | {
      children?: never
      description: string
    }

export type AlertProps = {
  className?: string
  heading: string
  headingLevel?: ADSAlertProps['headingLevel']
  severity?: ADSAlertProps['severity']
  /**
   * Pass a value that changes to `true` to trigger focus on the alert.
   * With `useActionState`, `!isPending` works well — it is `false` on submit and `true` when the response arrives.
   * Without `useActionState`, manage it yourself via a state variable.
   */
  shouldFocus: boolean
} & AlertContentProps

export const FocusableAlert = ({
  children,
  className,
  description,
  heading,
  headingLevel = 2,
  severity,
  shouldFocus,
}: AlertProps) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (shouldFocus) {
      ref.current?.focus()
    }
  }, [shouldFocus])

  return (
    <ADSAlert
      className={clsx(styles.alert, className)}
      heading={heading}
      headingId={null}
      headingLevel={headingLevel}
      ref={ref}
      role="alert"
      severity={severity}
      tabIndex={-1}
    >
      {children ?? <Paragraph>{description}</Paragraph>}
    </ADSAlert>
  )
}
