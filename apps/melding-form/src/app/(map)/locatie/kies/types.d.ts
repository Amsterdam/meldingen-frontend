import type { AlertProps } from '@amsterdam/design-system-react'

export type NotificationType = {
  closeButtonLabel: AlertProps['closeButtonLabel']
  description?: string
  heading: AlertProps['heading']
  severity?: AlertProps['severity']
}
