import {
  getMeldingByMeldingIdAnswers,
  getMeldingByMeldingIdMelder,
  getStaticForm,
  getStaticFormByStaticFormId,
} from '@meldingen/api-client'

import { handleApiError } from 'apps/public/src/handleApiError'

export const getMeldingData = async (meldingId: string, token: string) => {
  const { data, error } = await getMeldingByMeldingIdMelder({
    path: { melding_id: parseInt(meldingId, 10) },
    query: { token },
  })

  if (error) return { error: handleApiError(error) }

  if (!data) return { error: 'Melding data not found' }

  return { data }
}

export const getPrimaryFormSummary = async (description: string) => {
  const { data: staticFormsData, error: staticFormsError } = await getStaticForm()

  if (staticFormsError) return { error: handleApiError(staticFormsError) }

  if (!staticFormsData) return { error: 'Static forms data not found' }

  const primaryFormId = staticFormsData?.find((form) => form.type === 'primary')?.id

  if (!primaryFormId) return { error: 'Primary form id not found' }

  const { data: primaryFormData, error: primaryFormError } = await getStaticFormByStaticFormId({
    path: { static_form_id: primaryFormId },
  })

  if (primaryFormError) return { error: handleApiError(primaryFormError) }

  if (!primaryFormData) return { error: 'Primary form data not found' }

  const primaryForm = primaryFormData.components[0]

  return {
    data: { key: 'primary', term: primaryForm.label, description: [description] },
  }
}

export const getAdditionalQuestionsSummary = async (meldingId: string, token: string) => {
  const { data, error } = await getMeldingByMeldingIdAnswers({
    path: { melding_id: parseInt(meldingId, 10) },
    query: { token },
  })

  if (error) return { error: handleApiError(error) }

  return {
    data:
      data?.map((answer) => ({
        key: `${answer.question.id}`,
        term: answer.question.text,
        description: [answer.text],
      })) || [],
  }
}

export const getLocationSummary = (label: string, location?: string) => {
  const locationParsed = location ? JSON.parse(location).name : 'Er konden geen locatiegegevens worden gevonden.'

  return {
    key: 'location',
    term: label,
    description: [locationParsed],
  }
}

export const getContactSummary = (label: string, email?: string | null, phone?: string | null) => {
  if (!email && !phone) return undefined

  return {
    key: 'contact',
    term: label,
    description: [email, phone].filter((item) => item !== undefined && item !== null), // Filter out undefined or null items
  }
}
