export type Coordinates = { lat: number; lng: number }

export type ValidationError = {
  key: string
  message: string
}

export type FormState = {
  apiError?: unknown
  formData?: FormData
  validationErrors?: ValidationError[]
}
