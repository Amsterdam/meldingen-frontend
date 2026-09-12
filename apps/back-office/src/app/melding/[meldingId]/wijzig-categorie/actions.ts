'use server'
import { returnValidationErrors } from 'next-safe-action'
import { redirect } from 'next/navigation'
import { z } from 'zod'

import { ERRORS, REASON_COUNT_MAX_LENGTH } from './constants'
import { actionClient } from '~/app/_actions/actionClient'
import { postMeldingByMeldingIdReclassification } from '~/app/_api-client/proxy'

const changeCategorySchema = z.object({
  category: z.string(ERRORS.VALIDATION.CATEGORY_REQUIRED).nonempty(ERRORS.VALIDATION.CATEGORY_REQUIRED),
  reason: z
    .string(ERRORS.VALIDATION.REASON_REQUIRED)
    .trim()
    .nonempty(ERRORS.VALIDATION.REASON_REQUIRED)
    .max(REASON_COUNT_MAX_LENGTH, ERRORS.VALIDATION.REASON_MAX_LENGTH),
})

export const postChangeCategoryForm = actionClient
  .bindArgsSchemas([z.number(), z.number().optional()])
  .inputSchema(changeCategorySchema)
  .stateAction(
    async ({ bindArgsParsedInputs: [meldingId, currentClassificationId], parsedInput: { category, reason } }) => {
      if (currentClassificationId && Number(category) === currentClassificationId) {
        return returnValidationErrors(changeCategorySchema, {
          category: { _errors: [ERRORS.VALIDATION.CATEGORY_SAME] },
        })
      }
      await postMeldingByMeldingIdReclassification({
        body: {
          classification_id: Number(category),
          reason,
        },

        path: { melding_id: meldingId },
        throwOnError: true,
      })

      redirect(`/melding/${meldingId}`)
    },
  )
