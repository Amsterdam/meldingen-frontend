import {
  getMeldingByMeldingIdAnswers,
  getMeldingByMeldingIdMelder,
  getStaticForm,
  getStaticFormByStaticFormId,
} from '@meldingen/api-client'

import { handleApiError } from 'apps/public/src/handleApiError'
import type { Coordinates } from 'apps/public/src/types'

export type GenericSummaryData = {
  key: string
  term: string
  description: string[]
}

type Location = {
  name: string
  coordinates: Coordinates
}

export type AttachmentsSummary = {
  key: string
  term: string
  data: {
    file: Blob
    meta: { originalFilename: string; contentType: string }
  }[]
}

export const getMeldingData = async (meldingId: string, token: string) => {
  const { data: meldingData, error: meldingError } = await getMeldingByMeldingIdMelder({
    path: { melding_id: parseInt(meldingId, 10) },
    query: { token },
  })

  if (meldingError) return handleApiError(meldingError)

  if (!meldingData) return 'Melding data not found'

  return meldingData
}

export const getPrimaryFormSummary = async (description: string): Promise<GenericSummaryData | string> => {
  const { data: staticFormsData, error: staticFormsError } = await getStaticForm()

  if (staticFormsError) return handleApiError(staticFormsError)

  const primaryFormId = staticFormsData?.find((form) => form.type === 'primary')?.id

  if (!primaryFormId) return 'Primary form id not found'

  const { data: primaryFormData, error: primaryFormError } = await getStaticFormByStaticFormId({
    path: { static_form_id: primaryFormId },
  })

  if (primaryFormError) return handleApiError(primaryFormError)

  if (!primaryFormData) return 'Primary form data not found'

  const primaryForm = primaryFormData.components[0]

  return {
    key: 'primary',
    term: primaryForm.label,
    description: [description],
  }
}

export const getAdditionalQuestionsSummary = async (
  meldingId: string,
  token: string,
): Promise<GenericSummaryData[] | string> => {
  const { data, error } = await getMeldingByMeldingIdAnswers({
    path: { melding_id: parseInt(meldingId, 10) },
    query: { token },
  })

  if (error) return handleApiError(error)

  return (
    data?.map((answer) => ({
      key: `${answer.question.id}`,
      term: answer.question.text,
      description: [answer.text],
    })) || []
  )
}

export const getLocationSummary = (label: string, location?: string): GenericSummaryData => {
  const locationParsed: Location = location ? JSON.parse(location) : undefined

  return {
    key: 'location',
    term: label,
    description: [locationParsed.name].filter((item) => item !== undefined), // Filter out undefined items,
  }
}

export const getContactSummary = (
  label: string,
  email?: string | null,
  phone?: string | null,
): GenericSummaryData | undefined => {
  if (!email && !phone) return undefined

  return {
    key: 'contact',
    term: label,
    description: [email, phone].filter((item) => item !== undefined && item !== null), // Filter out undefined or null items
  }
}
