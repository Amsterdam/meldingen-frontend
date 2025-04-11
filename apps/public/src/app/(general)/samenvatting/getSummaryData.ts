import { cookies } from 'next/headers'
import { getTranslations } from 'next-intl/server'

import {
  getMeldingByMeldingIdAnswers,
  //   getMeldingByMeldingIdAttachmentByAttachmentIdDownload,
  //   getMeldingByMeldingIdAttachments,
  getMeldingByMeldingIdMelder,
  getStaticForm,
  getStaticFormByStaticFormId,
  MeldingOutput,
} from '@meldingen/api-client'

import { handleApiError } from 'apps/public/src/handleApiError'
import type { Coordinates } from 'apps/public/src/types'

type Result<T> = {
  data?: T
  error?: string
}

type MeldingDataResult = Result<GenericSummaryData> & {
  meldingData?: MeldingOutput | null
}

export type GenericSummaryData = {
  key: string
  term: string
  description: string[]
}

export type Location = {
  name: string
  coordinates: Coordinates
}

export type SummaryData = {
  melding?: GenericSummaryData
  additionalQuestionsAnswers?: GenericSummaryData[]
  location?: GenericSummaryData
  contact?: GenericSummaryData
}

const getMeldingData = async (meldingId: string, token: string): Promise<MeldingDataResult> => {
  const { data: staticFormsData, error: staticFormsError } = await getStaticForm()

  if (staticFormsError) return { error: handleApiError(staticFormsError) }

  const primaryFormId = staticFormsData?.find((form) => form.type === 'primary')?.id

  if (!primaryFormId) return { error: 'Primary form id not found' }

  const { data: primaryFormData, error: primaryFormError } = await getStaticFormByStaticFormId({
    path: { static_form_id: primaryFormId },
  })

  if (primaryFormError) return { error: handleApiError(primaryFormError) }

  if (!primaryFormData) return { error: 'Primary form data not found' }

  const primaryForm = primaryFormData.components[0]

  const { data: meldingData, error: meldingError } = await getMeldingByMeldingIdMelder({
    path: { melding_id: parseInt(meldingId, 10) },
    query: { token },
  })

  if (meldingError) return { error: handleApiError(meldingError) }

  if (!meldingData) return { error: 'Melding data not found' }

  return {
    data: {
      key: 'primary',
      term: primaryForm.label,
      description: [meldingData.text],
    },
    meldingData,
  }
}

const getAdditionalQuestionsData = async (meldingId: string, token: string): Promise<Result<GenericSummaryData[]>> => {
  const { data: additionalQuestionsData, error: additionalQuestionsErrors } = await getMeldingByMeldingIdAnswers({
    path: { melding_id: parseInt(meldingId, 10) },
    query: { token },
  })

  if (additionalQuestionsErrors) return { error: handleApiError(additionalQuestionsErrors) }

  return {
    data:
      additionalQuestionsData?.map((answer) => ({
        key: `${answer.question.id}`,
        term: answer.question.text,
        description: [answer.text],
      })) || [],
  }
}

const getLocationSummary = (label: string, location?: string): Result<GenericSummaryData> => {
  const locationParsed: Location = location ? JSON.parse(location) : undefined

  return {
    data: {
      key: 'location',
      term: label,
      description: [locationParsed.name].filter((item) => item !== undefined), // Filter out undefined items,
    },
  }
}

const getContactSummary = (label: string, email?: string | null, phone?: string | null) => {
  if (!email && !phone) return undefined

  return {
    key: 'contact',
    term: label,
    description: [email, phone].filter((item) => item !== undefined && item !== null), // Filter out undefined or null items
  }
}

export const getSummaryData = async (): Promise<{ data: SummaryData; error: string[] }> => {
  // Get session variables from cookies
  const cookieStore = await cookies()
  const meldingId = cookieStore.get('id')?.value
  const token = cookieStore.get('token')?.value
  const location = cookieStore.get('location')?.value

  const t = await getTranslations()

  if (!meldingId || !token) return { data: {}, error: ['Could not retrieve meldingId or token'] }

  const { data: meldingBodySummary, error: meldingError, meldingData } = await getMeldingData(meldingId, token)
  const { data: additionalQuestionsAnswers, error: additionalQuestionsAnswersError } = await getAdditionalQuestionsData(
    meldingId,
    token,
  )
  const { data: locationSummary, error: locationSummaryError } = getLocationSummary(t('location.title'), location)
  const contactSummary = getContactSummary(t('summary.contact-label'), meldingData?.email, meldingData?.phone)

  return {
    data: {
      melding: meldingBodySummary,
      additionalQuestionsAnswers,
      location: locationSummary,
      contact: contactSummary,
    },
    error: [meldingError, additionalQuestionsAnswersError, locationSummaryError].filter((error) => error) as string[],
  }
}
