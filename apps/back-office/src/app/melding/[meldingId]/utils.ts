import { getFullNLAddress } from '../../utils'
import {
  getAttachmentById,
  getMeldingByMeldingIdAnswers,
  getMeldingByMeldingIdAttachments,
  MeldingOutput,
} from 'apps/back-office/src/apiClientProxy'
import { handleApiError } from 'apps/back-office/src/handleApiError'

export const getAdditionalQuestionsData = async (meldingId: number) => {
  const { data, error } = await getMeldingByMeldingIdAnswers({
    path: { melding_id: meldingId },
  })

  if (error) return { error: handleApiError(error) }

  return {
    data:
      data?.map((answer) => ({
        key: String(answer.question.id),
        term: answer.question.text,
        description: answer.text,
      })) || [],
  }
}

export const getContactData = (data: MeldingOutput, t: (key: string) => string) => {
  const { email, phone } = data

  return [
    {
      key: 'email',
      term: t('detail.contact.email'),
      description: email ?? t('detail.contact.no-data'),
    },
    {
      key: 'phone',
      term: t('detail.contact.phone'),
      description: phone ?? t('detail.contact.no-data'),
    },
  ]
}

export const getMeldingData = (data: MeldingOutput, t: (key: string) => string) => {
  const { id, created_at, classification, state } = data

  return [
    {
      key: 'created_at',
      term: t('detail.melding-data.created_at'),
      description: new Date(created_at).toLocaleDateString('nl-NL'),
    },
    {
      key: 'classification',
      term: t('detail.melding-data.classification'),
      description: classification ? classification.name : t('detail.no-classification'),
    },
    {
      key: 'state',
      term: t('detail.melding-data.state.term'),
      description: t(`shared.state.${state}`),
      link: {
        href: `/melding/${id}/wijzig-status`,
        label: t('detail.melding-data.state.link'),
      },
    },
  ]
}

export const getLocationData = (data: MeldingOutput, t: (key: string) => string) => {
  const address = getFullNLAddress(data)

  if (!address) return undefined

  return [
    {
      key: 'address',
      term: t('detail.location.address'),
      description: address,
    },
  ]
}

export const getAttachmentsData = async (meldingId: number, t: (key: string) => string) => {
  const { data, error } = await getMeldingByMeldingIdAttachments({
    path: { melding_id: meldingId },
  })

  if (error) return { error: handleApiError(error) }

  const attachments = await Promise.all(
    data.map(async ({ id, original_filename }) => {
      const { data, error } = await getAttachmentById({
        path: { id },

        query: { type: 'thumbnail' },
      })

      if (error) {
        return { blob: null, fileName: original_filename, error: handleApiError(error) }
      }

      // Returning blob instead of File since the File api is not available in Node.js
      return {
        blob: data as Blob,
        fileName: original_filename,
      }
    }),
  )

  return { key: 'attachments', term: t('detail.attachments.title'), files: attachments }
}
