import type { AlertProps } from '@amsterdam/design-system-react'
import { Alert, Paragraph } from '@amsterdam/design-system-react'

import styles from './Notification.module.css'

export type Props = Omit<AlertProps, 'headingLevel'> & { description?: string }

export const Notification = ({ description, ...restProps }: Props) => (
  <Alert {...restProps} closeable className={styles.notification} headingLevel={2} tabIndex={-1}>
    {description && <Paragraph>{description}</Paragraph>}
  </Alert>
)
