export type FormState = {
  apiError?: unknown
  formData?: FormData
  validationErrors?: { key: string; message: string }[]
}
