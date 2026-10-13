import type { MeldingAttachment } from '../../types'
import type { AttachmentTypes } from '~/app/_api-client/proxy'

import { isFilePDF } from '../'
import { getAttachmentById, getMeldingByMeldingIdAttachments } from '~/app/_api-client/proxy'

export const getAttachmentsData = async (
  meldingId: number,
  imageAttachmentType: AttachmentTypes,
): Promise<MeldingAttachment[]> => {
  const { data: meldingAttachments, error } = await getMeldingByMeldingIdAttachments({
    path: { melding_id: meldingId },
  })

  if (error) throw new Error('Failed to fetch melding attachments.')

  return Promise.all(
    meldingAttachments.map(async ({ created_at, id, original_filename, updated_at, user }) => {
      const { data: attachmentBlob, error: getAttachmentByIdError } = await getAttachmentById({
        path: { id },
        query: { type: isFilePDF(original_filename) ? 'original' : imageAttachmentType },
      })

      if (getAttachmentByIdError) throw new Error('Failed to fetch melding attachment file.')

      return {
        blob: attachmentBlob as Blob,
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
}
