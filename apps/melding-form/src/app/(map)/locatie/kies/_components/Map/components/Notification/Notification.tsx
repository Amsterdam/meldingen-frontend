import type { AlertProps } from '@amsterdam/design-system-react'
import { Alert } from '@amsterdam/design-system-react'
import { useEffect, useRef } from 'react'

import styles from './Notification.module.css'

export const Notification = (props: AlertProps) => {
  const ref = useRef<HTMLDivElement>(null)

  // Set focus on the notification when it is rendered,
  // to make sure screen readers read the entire message
  useEffect(() => {
    if (ref.current) {
      ref.current.focus()
    }
  }, [ref])

  return <Alert {...props} className={styles.notification} ref={ref} tabIndex={-1} />
}
