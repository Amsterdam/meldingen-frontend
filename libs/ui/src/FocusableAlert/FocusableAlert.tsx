'use client'

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
    /**
     * The alert is focused whenever this value changes to a truthy value (and on mount, if it is truthy).
     * - With `useActionState`, `!isPending` works well: it is `false` on submit and `true` when the response arrives.
     * - To refocus when the same error is shown again, pass a new object for each occurrence (e.g. the error object itself).
     *   Strings and numbers do not work for this, as an identical value does not count as a change.
     */
    focusKey: unknown
    /** The hierarchical level of the Heading within the document. Defaults to 2 */
    headingLevel?: AlertProps['headingLevel']
  }

export const FocusableAlert = ({
  children,
  className,
  description,
  focusKey,
  heading,
  headingLevel = 2,
}: FocusableAlertProps) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (focusKey) {
      ref.current?.focus()
    }
  }, [focusKey])

  return (
    <ADSAlert
      className={clsx(styles.alert, className)}
      heading={heading}
      // Remove the default label for the Alert.
      // Otherwise, focusing on the Alert causes NVDA to read the label twice.
      headingId={null}
      headingLevel={headingLevel}
      ref={ref}
      // Avoid role="alert": NVDA then skips the Alert's Heading and announces only the body text.
      severity="error"
      tabIndex={-1}
    >
      {children}
      {description && <Paragraph>{description}</Paragraph>}
    </ADSAlert>
  )
}
