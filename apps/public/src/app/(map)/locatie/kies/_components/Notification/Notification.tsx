import type { AlertProps } from '@amsterdam/design-system-react'
import { Alert } from '@amsterdam/design-system-react'

import styles from './Notification.module.css'

export const Notification = (props: AlertProps) => <Alert {...props} className={styles.notification} severity="error" />
