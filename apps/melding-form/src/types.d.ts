export type Coordinates = { lat: number; lng: number }

export type ValidationError = {
  key: string
  message: string
}

export type FormState = {
  errorMessage?: string
  formData?: FormData
  validationErrors?: ValidationError[]
}
