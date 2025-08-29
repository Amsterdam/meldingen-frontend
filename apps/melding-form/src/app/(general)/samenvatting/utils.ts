import {
  getMeldingByMeldingIdAnswersMelder,
  getMeldingByMeldingIdAttachmentByAttachmentIdDownload,
  getMeldingByMeldingIdAttachmentsMelder,
  getStaticForm,
  getStaticFormByStaticFormId,
} from '@meldingen/api-client'

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
    data: { key: 'primary', term: primaryForm.label, description: [description] },
  }
}

export const getAdditionalQuestionsSummary = async (meldingId: string, token: string) => {
  const { data, error } = await getMeldingByMeldingIdAnswersMelder({
    path: { melding_id: parseInt(meldingId, 10) },
    query: { token },
  })

  if (error) throw new Error('Failed to fetch additional questions data.')

  return {
    data:
      data?.map((answer) => ({
        key: `${answer.question.id}`,
        term: answer.question.text,
        description: [answer.text],
      })) || [],
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

export const getLocationSummary = (t: (key: string) => string, location?: string) => {
  const locationParsed = location ? JSON.parse(location).name : t('errors.no-location')

  return {
    key: 'location',
    term: t('location-label'),
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
