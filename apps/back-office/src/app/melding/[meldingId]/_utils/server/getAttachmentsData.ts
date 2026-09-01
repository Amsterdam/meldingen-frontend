import { getApiErrorMessage } from '@meldingen/api-client'

import { isFilePDF } from '../'
import { getAttachmentById, getMeldingByMeldingIdAttachments } from '~/app/_api-client/proxy'

export const getAttachmentsData = async (meldingId: number, t: (key: string) => string) => {
  const { data, error } = await getMeldingByMeldingIdAttachments({
    path: { melding_id: meldingId },
  })

  if (error) return { error: getApiErrorMessage(error) }

  const attachments = await Promise.all(
    data.map(async ({ created_at, id, original_filename }) => {
      const { data: attachmentBlob, error } = await getAttachmentById({
        path: { id },
        query: { type: isFilePDF(original_filename) ? 'original' : 'thumbnail' },
      })

      if (error) {
        return {
          blob: null,
          createdAt: created_at,
          error: getApiErrorMessage(error),
          fileName: original_filename,
          id,
        }
      }

      // Returning blob instead of File since the File api is not available in Node.js
      return {
        blob: attachmentBlob as Blob,
        createdAt: created_at,
        fileName: original_filename,
        id,
      }
    }),
  )

  return { files: attachments, key: 'attachments', term: t('detail.attachments.title') }
}
