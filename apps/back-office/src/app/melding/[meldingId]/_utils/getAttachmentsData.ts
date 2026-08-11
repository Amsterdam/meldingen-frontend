import { getAttachmentById, getMeldingByMeldingIdAttachments } from '~/app/_api-client/proxy'
import { handleApiError } from '~/app/_utils/handleApiError'

export const getAttachmentsData = async (meldingId: number, t: (key: string) => string) => {
  const { data, error } = await getMeldingByMeldingIdAttachments({
    path: { melding_id: meldingId },
  })

  if (error) return { error: handleApiError(error) }

  const attachments = await Promise.all(
    data.map(async ({ created_at, id, original_filename }) => {
      const { data: attachmentBlob, error } = await getAttachmentById({
        path: { id },
        query: { type: 'thumbnail' },
      })

      if (error) {
        return {
          blob: null,
          createdAt: created_at,
          error: handleApiError(error),
          fileName: original_filename,
        }
      }

      // Returning blob instead of File since the File api is not available in Node.js
      return {
        blob: attachmentBlob as Blob,
        createdAt: created_at,
        fileName: original_filename,
      }
    }),
  )

  return { files: attachments, key: 'attachments', term: t('detail.attachments.title') }
}
