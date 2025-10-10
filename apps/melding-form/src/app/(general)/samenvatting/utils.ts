import {
  FormPanelComponentOutput,
  getFormClassificationByClassificationId,
  getMeldingByMeldingIdAnswersMelder,
  getMeldingByMeldingIdAttachmentByAttachmentIdDownload,
  getMeldingByMeldingIdAttachmentsMelder,
  getStaticForm,
  getStaticFormByStaticFormId,
  MeldingOutput,
} from '@meldingen/api-client'

import { getFullNLAddress } from '../_utils/getFullNLAddress'
import { handleApiError } from 'apps/melding-form/src/handleApiError'

export const getPrimaryFormSummary = async (description: string) => {
  const { data: staticFormsData, error: staticFormsError } = await getStaticForm()

  if (staticFormsError) throw new Error('Failed to fetch static forms.')
  if (!staticFormsData) throw new Error('Static forms data not found.')

  const primaryFormId = staticFormsData?.find((form) => form.type === 'primary')?.id

  if (!primaryFormId) throw new Error('Primary form id not found.')

  const { data: primaryFormData, error: primaryFormError } = await getStaticFormByStaticFormId({
    path: { static_form_id: primaryFormId },
  })

  if (primaryFormError) throw new Error('Failed to fetch primary form data.')
  if (!primaryFormData) throw new Error('Primary form data not found.')

  const primaryForm = primaryFormData.components[0]

  return {
    data: { key: 'primary', term: primaryForm.label, description },
  }
}

const findPanelIdByQuestionId = (panels: FormPanelComponentOutput[], id: number) => {
  for (const panel of panels) {
    for (const component of panel.components) {
      if (component.question === id) {
        return panel.key
      }
    }
  }
  return undefined
}

export const getAdditionalQuestionsSummary = async (meldingId: string, token: string, classificationId?: number) => {
  if (!classificationId) return { data: [] }

  const { data: formComponents, error: formError } = await getFormClassificationByClassificationId({
    path: { classification_id: classificationId },
  })

  if (formError) {
    // Not Found error is returned when the classification does not have additional questions
    if (handleApiError(formError) === 'Not Found') return { data: [] }
    throw new Error('Failed to fetch form by classification.')
  }

  const { data, error } = await getMeldingByMeldingIdAnswersMelder({
    path: { melding_id: parseInt(meldingId, 10) },
    query: { token },
  })

  if (error) throw new Error('Failed to fetch additional questions data.')

  return {
    data:
      data?.map((answer) => {
        const panels = formComponents.components as FormPanelComponentOutput[]
        const panelId = findPanelIdByQuestionId(panels, answer.question.id)
        return {
          key: `${answer.question.id}`,
          term: answer.question.text,
          description: answer.text,
          link: panelId ? `/aanvullende-vragen/${classificationId}/${panelId}` : '/',
        }
      }) || [],
  }
}

export const getAttachmentsSummary = async (label: string, meldingId: string, token: string) => {
  const { data, error } = await getMeldingByMeldingIdAttachmentsMelder({
    path: { melding_id: parseInt(meldingId, 10) },
    query: { token },
  })

  if (error) throw new Error('Failed to fetch attachments data.')
  if (!data) throw new Error('Attachments data not found.')

  const attachments = await Promise.all(
    data.map(async ({ id, original_filename }) => {
      const { data, error, response } = await getMeldingByMeldingIdAttachmentByAttachmentIdDownload({
        path: { melding_id: parseInt(meldingId, 10), attachment_id: id },

        query: { token, type: 'thumbnail' },
      })

      const contentType = response.headers.get('content-type')

      if (error) throw new Error('Failed to fetch attachment download.')
      if (!data) throw new Error('Attachment download data not found.')

      // Returning blob instead of File since the File api is not available in Node.js
      return {
        blob: data as Blob,
        fileName: original_filename,
        contentType: contentType!,
      }
    }) || [],
  )

  return { data: { key: 'attachments', term: label, files: attachments } }
}

export const getLocationSummary = (t: (key: string) => string, meldingData: MeldingOutput) => {
  const address = getFullNLAddress(meldingData) || t('errors.no-location')

  return {
    key: 'location',
    term: t('location-label'),
    description: address,
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
