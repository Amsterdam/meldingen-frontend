'use client'

import { Alert, InvalidFormAlertProps, LinkList } from '@amsterdam/design-system-react'
import { forwardRef, useImperativeHandle, useRef } from 'react'

import styles from './InvalidFormAlert.module.css'

// TODO: Copied this from Amsterdam Design System, because their built in focus on render and change page title does not work well.
// Replace with ADS component when they've fixed that.

export const InvalidFormAlert = forwardRef(
  (
    {
      className,
      errors,
      heading = 'Verbeter de fouten voor u verder gaat',
      headingLevel,
      ...restProps
    }: InvalidFormAlertProps,
    ref,
  ) => {
    const innerRef = useRef<HTMLDivElement>(null)

    // use a passed ref if it's there, otherwise use innerRef
    useImperativeHandle(ref, () => innerRef.current as HTMLDivElement)

    return (
      <Alert
        {...restProps}
        className={`${styles.alert}${className ? ` ${className}` : ''}`}
        heading={heading}
        headingLevel={headingLevel}
        ref={innerRef}
        severity="error"
        tabIndex={-1}
      >
        <LinkList>
          {errors.map(({ id, label }) => (
            <LinkList.Link href={id} key={`${id}-${label}`}>
              {label}
            </LinkList.Link>
          ))}
        </LinkList>
      </Alert>
    )
  },
)
