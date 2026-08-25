'use server'

import { deleteAttachmentById, postMeldingByMeldingIdAttachment } from '~/app/_api-client/proxy'
import { handleApiError } from '~/app/_utils/handleApiError'

export const uploadAttachmentAction = async (meldingId: number, file: File) => {
  const { data, error } = await postMeldingByMeldingIdAttachment({
    body: {
      file,
    },
    path: { melding_id: meldingId },
  })

  return {
    error: error ? handleApiError(error) : undefined,
    serverId: data?.id,
  }
}

// serverId is attachment ID
export const deleteAttachmentAction = async (serverId: number) => {
  const { error, response } = await deleteAttachmentById({
    path: { id: serverId },
  })

  return {
    error: error ? handleApiError(error) : undefined,
    status: response?.status,
  }
}
