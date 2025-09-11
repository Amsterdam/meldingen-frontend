import type { AlertProps } from '@amsterdam/design-system-react'
import { Alert, Paragraph } from '@amsterdam/design-system-react'

import styles from './Notification.module.css'

export const Notification = ({
  description,
  ...restProps
}: Omit<AlertProps, 'headingLevel'> & { description?: string }) => (
  <Alert {...restProps} closeable className={styles.notification} headingLevel={2} tabIndex={-1}>
    {description && <Paragraph>{description}</Paragraph>}
  </Alert>
)
