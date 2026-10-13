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

type ADSOriginalAlertProps = Pick<ADSAlertProps, 'heading' | 'role'>
export type FocusableAlertProps = ADSOriginalAlertProps &
  AlertContentProps & {
    className?: string
    /**
     * The hierarchical level of the Heading within the document. Defaults to 2
     */
    headingLevel?: ADSAlertProps['headingLevel']
    /** The significance of the message conveyed. Defaults to 'error' */
    severity?: ADSAlertProps['severity']
    /**
     * Pass a value that changes to `true` to trigger focus on the alert.
     * With `useActionState`, `!isPending` works well — it is `false` on submit and `true` when the response arrives.
     * Without `useActionState`, manage it yourself via a state variable.
     */
    shouldFocus: boolean
  }

export const FocusableAlert = ({
  children,
  className,
  description,
  heading,
  headingLevel = 2,
  role,
  severity = 'error',
  shouldFocus,
}: FocusableAlertProps) => {
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
      role={role}
      severity={severity}
      tabIndex={-1}
    >
      {children ?? <Paragraph>{description}</Paragraph>}
    </ADSAlert>
  )
}
