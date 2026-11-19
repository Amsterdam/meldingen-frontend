import type { MeldingAttachment } from '../../types'
import type { AttachmentOutput, AttachmentTypes } from '~/app/_api-client/proxy'

import { getAttachmentById, getMeldingByMeldingIdAttachments } from '~/app/_api-client/proxy'

const getImageTypeQuery = (
  { optimized, thumbnail }: Pick<AttachmentOutput, 'optimized' | 'thumbnail'>,
  targetType: AttachmentTypes,
): AttachmentTypes => {
  switch (targetType) {
    case 'optimized':
      return optimized ? 'optimized' : 'original'
    case 'thumbnail':
      return thumbnail ? 'thumbnail' : 'original'
    default:
      return 'original'
  }
}

export const getAttachmentsData = async (
  meldingId: number,
  imageAttachmentType: AttachmentTypes,
): Promise<MeldingAttachment[]> => {
  const { data: meldingAttachments, error } = await getMeldingByMeldingIdAttachments({
    path: { melding_id: meldingId },
  })

  if (error) throw new Error('Failed to fetch melding attachments.')

  return Promise.all(
    meldingAttachments.map(
      async ({ created_at, id, is_image: isImage, optimized, original_filename, thumbnail, updated_at, user }) => {
        const typeQuery = isImage ? getImageTypeQuery({ optimized, thumbnail }, imageAttachmentType) : 'original'

        const { data: attachmentBlob, error: getAttachmentByIdError } = await getAttachmentById({
          path: { id },
          query: { type: typeQuery },
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
      },
    ),
  )
}
