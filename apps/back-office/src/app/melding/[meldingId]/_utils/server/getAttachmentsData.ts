import { getApiErrorMessage } from '@meldingen/api-client'

import type { MeldingAttachment } from '../../types'
import type { AttachmentTypes } from '~/app/_api-client/proxy'

import { isFilePDF } from '../'
import { getAttachmentById, getMeldingByMeldingIdAttachments } from '~/app/_api-client/proxy'

export type GetAttachmentsDataResult = {
  attachmentsWithFile: MeldingAttachment[]
  error?: string
}

export const getAttachmentsData = async (
  meldingId: number,
  imageAttachmentType: AttachmentTypes = 'optimized',
): Promise<GetAttachmentsDataResult> => {
  const { data: meldingAttachments, error: error } = await getMeldingByMeldingIdAttachments({
    path: { melding_id: meldingId },
  })

  if (error) {
    return {
      attachmentsWithFile: [],
      error: getApiErrorMessage(error),
    }
  }

  const attachmentsWithFile = await Promise.all(
    meldingAttachments.map(async ({ created_at, id, original_filename, updated_at, user }) => {
      const { data: attachmentBlob, error: getAttachmentByIdError } = await getAttachmentById({
        path: { id },
        query: { type: isFilePDF(original_filename) ? 'original' : imageAttachmentType },
      })

      return {
        blob: getAttachmentByIdError ? null : (attachmentBlob as Blob),
        createdAt: created_at,
        id,
        originalFilename: original_filename,
        updatedAt: updated_at,
        ...(user && {
          user: {
            email: user.email,
            id: user.id,
            username: user.username,
          },
        }),
      }
    }),
  )

  return { attachmentsWithFile }
}
