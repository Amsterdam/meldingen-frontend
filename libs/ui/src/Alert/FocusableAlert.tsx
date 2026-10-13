'use client'

import type { AlertProps as ADSAlertProps } from '@amsterdam/design-system-react'

import { Alert as ADSAlert, Paragraph } from '@amsterdam/design-system-react'
import { clsx } from 'clsx'
import { useEffect, useRef } from 'react'

import styles from './FocusableAlert.module.css'

export type AlertProps = Omit<ADSAlertProps, 'headingLevel' | 'headingId'> & {
  description?: string
  /**
   * The hierarchical level of the Heading within the document. Defaults to 2.
   */
  headingLevel?: ADSAlertProps['headingLevel']
  shouldFocus?: boolean
}

export const FocusableAlert = ({
  children,
  className,
  description,
  headingLevel = 2,
  shouldFocus,
  ...props
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
      headingId={null}
      headingLevel={headingLevel}
      ref={ref}
      role="alert"
      tabIndex={shouldFocus ? -1 : undefined}
      {...props}
    >
      {description && <Paragraph>{description}</Paragraph>}
      {children}
    </ADSAlert>
  )
}
