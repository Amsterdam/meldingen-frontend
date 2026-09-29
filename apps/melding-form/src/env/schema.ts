import * as z from 'zod'

export const serverSchema = z.object({
  NEXT_INTERNAL_BACKEND_BASE_URL: z.string(),
})

export const clientSchema = z.object({
  NEXT_PUBLIC_BACK_OFFICE_BASE_URL: z.string(),
  NEXT_PUBLIC_BACKEND_BASE_URL: z.string(),
  NEXT_PUBLIC_MELDING_FORM_BASE_URL: z.string(),
})
