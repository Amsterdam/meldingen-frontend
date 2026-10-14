import type { AlertProps } from '@amsterdam/design-system-react'

import { Alert as ADSAlert, Paragraph } from '@amsterdam/design-system-react'
import { clsx } from 'clsx'
import { useEffect, useRef } from 'react'

import styles from './FocusableAlert.module.css'

type ADSOriginalAlertProps = Pick<AlertProps, 'heading' | 'className'>

type ContentProps =
  { children: AlertProps['children']; description?: never } | { children?: never; description?: string }

export type FocusableAlertProps = ADSOriginalAlertProps &
  ContentProps & {
    /** The hierarchical level of the Heading within the document. Defaults to 2 */
    headingLevel?: AlertProps['headingLevel']
    /** The significance of the message conveyed. Defaults to 'error' */
    severity?: AlertProps['severity']
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
      // Remove the default label for the Alert.
      // Otherwise, focusing on the Alert causes NVDA to read the label twice.
      headingId={null}
      headingLevel={headingLevel}
      ref={ref}
      role={role}
      severity="error"
      tabIndex={-1}
    >
      {children}
      {description && <Paragraph>{description}</Paragraph>}
    </ADSAlert>
  )
}
