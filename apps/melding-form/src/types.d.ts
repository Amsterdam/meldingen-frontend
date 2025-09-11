import type { AlertProps } from '@amsterdam/design-system-react'

export type Coordinates = { lat: number; lng: number }

export type ValidationError = {
  key: string
  message: string
}

export type FormState = {
  formData?: FormData
  systemError?: unknown
  validationErrors?: ValidationError[]
}

export type NotificationType = {
  heading: AlertProps['heading']
  closeButtonLabel: AlertProps['closeButtonLabel']
  severity?: AlertProps['severity']
  description?: string
  showInAssetList?: boolean
}
