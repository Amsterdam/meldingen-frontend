import {
  FormPanelComponentOutput,
  getFormClassificationByClassificationId,
  getMeldingByMeldingIdAnswersMelder,
  GetMeldingByMeldingIdAnswersMelderResponses,
  getMeldingByMeldingIdAttachmentByAttachmentIdDownload,
  getMeldingByMeldingIdAttachmentsMelder,
  getStaticForm,
  getStaticFormByStaticFormId,
  MeldingOutput,
  ValueLabelObject,
} from '@meldingen/api-client'
import { getMeldingByMeldingIdMelder } from '@meldingen/api-client'

import { getFullNLAddress } from '../_utils/getFullNLAddress'
import { handleApiError } from 'apps/melding-form/src/handleApiError'

export const getMeldingData = async (meldingId: string, token: string) => {
  const { data, error } = await getMeldingByMeldingIdMelder({
    path: { melding_id: parseInt(meldingId, 10) },
    query: { token },
  })

  if (error) throw new Error('Failed to fetch melding data.')

  return data
}

export const getPrimaryFormSummary = async (description: string) => {
  const { data: staticFormsData, error: staticFormsError } = await getStaticForm()

  if (staticFormsError) throw new Error('Failed to fetch static forms.')

  const primaryFormId = staticFormsData.find((form) => form.type === 'primary')?.id

  if (!primaryFormId) throw new Error('Primary form id not found.')

  const { data: primaryFormData, error: primaryFormError } = await getStaticFormByStaticFormId({
    path: { static_form_id: primaryFormId },
  })

  if (primaryFormError) throw new Error('Failed to fetch primary form data.')

  const primaryForm = primaryFormData.components[0]

  return {
    data: { description, key: 'primary', term: primaryForm.label },
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

const getDescription = (answer: GetMeldingByMeldingIdAnswersMelderResponses['200'][number]) => {
  switch (answer.type) {
    case 'text':
      return answer.text
    case 'time':
      return answer.time
    case 'value_label':
      return answer.values_and_labels.map((option: ValueLabelObject) => option.label).join(', ')
    default:
      return ''
  }
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
    data: data.map((answer) => {
      const panels = formComponents.components as FormPanelComponentOutput[]
      const panelId = findPanelIdByQuestionId(panels, answer.question.id)

      return {
        description: getDescription(answer),
        key: `${answer.question.id}`,
        link: panelId ? `/aanvullende-vragen/${classificationId}/${panelId}` : '/',
        term: answer.question.text,
      }
    }),
  }
}

export const getAttachmentsSummary = async (label: string, meldingId: string, token: string) => {
  const { data, error } = await getMeldingByMeldingIdAttachmentsMelder({
    path: { melding_id: parseInt(meldingId, 10) },
    query: { token },
  })

  if (error) throw new Error('Failed to fetch attachments data.')

  const attachments = await Promise.all(
    data.map(async ({ id, original_filename }) => {
      const { data, error } = await getMeldingByMeldingIdAttachmentByAttachmentIdDownload({
        path: { attachment_id: id, melding_id: parseInt(meldingId, 10) },

        query: { token, type: 'thumbnail' },
      })

      if (error) throw new Error('Failed to fetch attachment download.')

      // Returning blob instead of File since the File api is not available in Node.js
      return {
        blob: data as Blob,
        fileName: original_filename,
      }
    }),
  )

  return { files: attachments, key: 'attachments', term: label }
}

export const getLocationSummary = (t: (key: string) => string, meldingData: MeldingOutput) => {
  const address = getFullNLAddress(meldingData) || t('errors.no-location')

  return {
    description: address,
    key: 'location',
    term: t('location-label'),
  }
}

export const getContactSummary = (label: string, email?: string | null, phone?: string | null) => {
  if (!email && !phone) return undefined

  return {
    description: [email, phone].filter((item) => item !== undefined && item !== null), // Filter out undefined or null items
    key: 'contact',
    term: label,
  }
}
