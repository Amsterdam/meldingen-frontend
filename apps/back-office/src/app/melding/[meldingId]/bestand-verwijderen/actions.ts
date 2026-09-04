'use server'

import { getApiErrorMessage } from '@meldingen/api-client'

import { deleteAttachmentById } from '~/app/_api-client/proxy'

export const deleteAttachmentAction = async (serverId: number) => {
  const { error, response } = await deleteAttachmentById({
    path: { id: serverId },
  })

  return {
    error: error ? getApiErrorMessage(error) : undefined,
    status: response?.status,
  }
}
