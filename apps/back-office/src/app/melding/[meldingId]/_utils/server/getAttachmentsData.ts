import type { MeldingAttachmentWithFile } from '../../types'

import { isFilePDF } from '../'
import { getAttachmentById, getMeldingByMeldingIdAttachments } from '~/app/_api-client/proxy'
import { handleApiError } from '~/app/_utils/handleApiError'

export const getAttachmentsData = async (meldingId: number): Promise<MeldingAttachmentWithFile[]> => {
  try {
    const { data: meldingAttachments, error: getMeldingByMeldingIdAttachmentsError } =
      await getMeldingByMeldingIdAttachments({
        path: { melding_id: meldingId },
      })

    if (getMeldingByMeldingIdAttachmentsError) {
      return Promise.reject(handleApiError(getMeldingByMeldingIdAttachmentsError))
    }

    const attachmentsWithFile = await Promise.all(
      meldingAttachments.map(async ({ created_at, id, original_filename, updated_at, user }) => {
        const { data: attachmentBlob, error: getAttachmentByIdError } = await getAttachmentById({
          path: { id },
          query: { type: isFilePDF(original_filename) ? 'original' : 'thumbnail' },
        })

        if (getAttachmentByIdError || !attachmentBlob) {
          return Promise.reject(handleApiError(getAttachmentByIdError))
        }

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

    return attachmentsWithFile
  } catch (caughtError) {
    return Promise.reject(caughtError)
  }
}
