'use server'

import { deleteAttachmentById } from '~/app/_api-client/proxy'
import { handleApiError } from '~/app/_utils/handleApiError'

export const deleteAttachmentAction = async (serverId: number) => {
  const { error, response } = await deleteAttachmentById({
    path: { id: serverId },
  })

  return {
    error: error ? handleApiError(error) : undefined,
    status: response?.status,
  }
}
