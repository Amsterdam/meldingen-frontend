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
  closeButtonLabel: AlertProps['closeButtonLabel']
  description?: string
  heading: AlertProps['heading']
  severity?: AlertProps['severity']
  showInAssetList?: boolean
}
