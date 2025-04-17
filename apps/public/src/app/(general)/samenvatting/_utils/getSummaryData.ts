import {
  getMeldingByMeldingIdAnswers,
  getMeldingByMeldingIdAttachmentByAttachmentIdDownload,
  getMeldingByMeldingIdAttachments,
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

  if (meldingError) throw new Error(handleApiError(meldingError))

  if (!meldingData) throw new Error('Melding data not found')

  return meldingData
}

export const getPrimaryFormSummary = async (description: string): Promise<GenericSummaryData> => {
  const { data: staticFormsData, error: staticFormsError } = await getStaticForm()

  if (staticFormsError) throw new Error(handleApiError(staticFormsError))

  const primaryFormId = staticFormsData?.find((form) => form.type === 'primary')?.id

  if (!primaryFormId) throw new Error('Primary form id not found')

  const { data: primaryFormData, error: primaryFormError } = await getStaticFormByStaticFormId({
    path: { static_form_id: primaryFormId },
  })

  if (primaryFormError) throw new Error(handleApiError(primaryFormError))

  if (!primaryFormData) throw new Error('Primary form data not found')

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
): Promise<GenericSummaryData[]> => {
  const { data, error } = await getMeldingByMeldingIdAnswers({
    path: { melding_id: parseInt(meldingId, 10) },
    query: { token },
  })

  if (error) throw new Error(handleApiError(error))

  return (
    data?.map((answer) => ({
      key: `${answer.question.id}`,
      term: answer.question.text,
      description: [answer.text],
    })) || []
  )
}

export const getAttachmentsSummary = async (
  label: string,
  meldingId: string,
  token: string,
): Promise<AttachmentsSummary> => {
  const { data: attachmentsData, error: attachmentsError } = await getMeldingByMeldingIdAttachments({
    path: { melding_id: parseInt(meldingId, 10) },
    query: { token },
  })

  if (attachmentsError) throw new Error(handleApiError(attachmentsError))

  if (!attachmentsData) throw new Error('Attachments data not found')

  const attachments = await Promise.all(
    attachmentsData?.map(async (attachmentDetails) => {
      const {
        data: attachmentData,
        error: attachmentError,
        response,
      } = await getMeldingByMeldingIdAttachmentByAttachmentIdDownload({
        path: { melding_id: parseInt(meldingId, 10), attachment_id: attachmentDetails.id },

        query: { token, type: 'thumbnail' },
      })
      const contentType = response.headers.get('content-type')

      if (attachmentError || !contentType) throw new Error(handleApiError(attachmentError))

      if (!attachmentData) throw new Error('Attachment data not found')

      return {
        file: attachmentData as Blob,
        meta: { originalFilename: attachmentDetails.original_filename, contentType },
      }
    }) || [],
  )

  return { key: 'attachments', term: label, data: attachments }
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
