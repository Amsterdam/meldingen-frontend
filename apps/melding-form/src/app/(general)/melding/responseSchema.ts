import * as z from 'zod'

export const responseSchema = z.discriminatedUnion('type', [
  z.object({ redirectUrl: z.string(), type: z.literal('success') }),
  z.object({
    type: z.literal('validation-error'),
    validationErrors: z.array(z.object({ key: z.string(), message: z.string() })),
  }),
  z.object({ apiError: z.unknown(), type: z.literal('api-error') }),
])

export type PrimaryFormResponse = z.infer<typeof responseSchema>
