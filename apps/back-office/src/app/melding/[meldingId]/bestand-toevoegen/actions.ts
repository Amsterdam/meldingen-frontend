'use server'

import { postMeldingByMeldingIdAttachment } from '@meldingen/api-client'

import { handleApiError } from '~/app/_utils/handleApiError'

export const uploadAttachmentAction = async (meldingId: number, file: File) => {
  const formData = new FormData()

  formData.set('file', file)

  const { data, error } = await postMeldingByMeldingIdAttachment({
    body: {
      file,
    },
    path: { melding_id: meldingId },
  })

  return {
    apiError: error ? handleApiError(error) : undefined,
    serverId: data?.id,
  }
}
