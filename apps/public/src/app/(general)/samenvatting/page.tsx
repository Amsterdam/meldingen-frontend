import { cookies } from 'next/headers'
import { getTranslations } from 'next-intl/server'

import {
  getMeldingByMeldingIdAnswers,
  getMeldingByMeldingIdAttachmentByAttachmentIdDownload,
  getMeldingByMeldingIdAttachments,
  getMeldingByMeldingIdMelder,
  getStaticForm,
  getStaticFormByStaticFormId,
} from '@meldingen/api-client'

import { getSummaryData } from './_utils/getSummaryData'
import { Summary } from './Summary'
import { handleApiError } from 'apps/public/src/handleApiError'

export const generateMetadata = async () => {
  const t = await getTranslations('summary')

  return {
    title: t('metadata.title'),
  }
}

export default async () => {
  // Get session variables from cookies
  const cookieStore = await cookies()
  const meldingId = cookieStore.get('id')?.value
  const token = cookieStore.get('token')?.value
  const location = cookieStore.get('location')?.value

  if (!meldingId || !token) return undefined

  // Primary form

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

  // Melding

  const { data: meldingData, error: meldingError } = await getMeldingByMeldingIdMelder({
    path: { melding_id: parseInt(meldingId, 10) },
    query: { token },
  })

  if (meldingError) return handleApiError(meldingError)

  if (!meldingData) return 'Melding data not found'

  // Additional questions

  const { data: additionalQuestionsData, error: additionalQuestionsErrors } = await getMeldingByMeldingIdAnswers({
    path: { melding_id: parseInt(meldingId, 10) },
    query: { token },
  })

  if (additionalQuestionsErrors) return handleApiError(additionalQuestionsErrors)

  const { data: attachmentsData, error: attachmentsError } = await getMeldingByMeldingIdAttachments({
    path: { melding_id: parseInt(meldingId, 10) },
    query: { token },
  })

  if (attachmentsError) return handleApiError(attachmentsError)

  if (!attachmentsData) return 'Attachments data not found'

  const attachments = await Promise.all(
    attachmentsData?.map(async (attachmentDetails) => {
      const { data: attachmentData, error: attachmentError } =
        await getMeldingByMeldingIdAttachmentByAttachmentIdDownload({
          path: { melding_id: parseInt(meldingId, 10), attachment_id: attachmentDetails.id },

          query: { token, type: 'thumbnail' },
        })

      if (attachmentError) return handleApiError(attachmentError)

      if (!attachmentData) return 'Attachment data not found'

      return data
    }) || [],
  )

  console.log('--- attachments:', attachments)

  const t = await getTranslations()

  const data = getSummaryData({
    melding: meldingData,
    primaryFormLabel: primaryForm?.label ?? '',
    additionalQuestionsAnswers: additionalQuestionsData ?? [],
    location: location ? JSON.parse(location) : undefined,
    locationLabel: t('location.title'),
    contactLabel: t('summary.contact-label'),
  })

  return <Summary data={data} />
}
