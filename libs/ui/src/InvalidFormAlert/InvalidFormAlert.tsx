'use client'

import type { InvalidFormAlertProps } from '@amsterdam/design-system-react'
import type { HTMLAttributes } from 'react'

import { Alert, LinkList } from '@amsterdam/design-system-react'
import { clsx } from 'clsx'
import { useEffect, useRef } from 'react'

import styles from './InvalidFormAlert.module.css'

// TODO: Copied this from Amsterdam Design System, because their built in focus on render and change page title does not work well.
// Replace with ADS component when they've fixed that.

type Props = HTMLAttributes<HTMLDivElement> & {
  errors: { key: string; message: string }[]
  heading?: InvalidFormAlertProps['heading']
  headingLevel: InvalidFormAlertProps['headingLevel']
}

export const InvalidFormAlert = ({
  className,
  errors,
  heading = 'Verbeter de fouten voor u verder gaat',
  headingLevel,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => ref.current?.focus(), [errors])

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
