'use client'

import type { InvalidFormAlertProps as ADSInvalidFormAlertProps } from '@amsterdam/design-system-react'
import type { HTMLAttributes } from 'react'

import { Alert, LinkList } from '@amsterdam/design-system-react'
import { clsx } from 'clsx'
import { useEffect, useRef } from 'react'

import styles from './InvalidFormAlert.module.css'

// TODO: Copied this from Amsterdam Design System, because their built in focus on render and change page title does not work well.
// Replace with ADS component when they've fixed that.

export type InvalidFormAlertProps = {
  errors: { key: string; message: string }[]
  heading?: ADSInvalidFormAlertProps['heading']
  headingLevel: ADSInvalidFormAlertProps['headingLevel']
  /**
   * Pass a value that changes to `true` to trigger focus on the alert.
   * With `useActionState`, `!isPending` works well — it is `false` on submit and `true` when the response arrives.
   * Without `useActionState`, manage it yourself via a state variable: set it to `false` on submit and back to `true` on response.
   */
  shouldFocus: boolean
} & HTMLAttributes<HTMLDivElement>

export const InvalidFormAlert = ({
  className,
  errors,
  heading = 'Verbeter de fouten voor u verder gaat',
  headingLevel,
  shouldFocus,
  ...restProps
}: InvalidFormAlertProps) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (shouldFocus) ref.current?.focus()
  }, [shouldFocus])

  if (errors.length === 0) return null

  const mappedErrors = errors.map((error) => ({
    id: `#${error.key}`,
    label: error.message,
  }))

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
      <LinkList>
        {mappedErrors.map(({ id, label }) => (
          <LinkList.Link href={id} key={`${id}-${label}`}>
            {label}
          </LinkList.Link>
        ))}
      </LinkList>
    </Alert>
  )
}
