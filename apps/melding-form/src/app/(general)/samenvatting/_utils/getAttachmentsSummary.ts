import {
  getMeldingByMeldingIdAttachmentByAttachmentIdDownload,
  getMeldingByMeldingIdAttachmentsMelder,
} from '@meldingen/api-client'

export const getAttachmentsSummary = async (label: string, meldingId: string, token: string) => {
  const { data, error } = await getMeldingByMeldingIdAttachmentsMelder({
    path: { melding_id: parseInt(meldingId, 10) },
    query: { token },
  })

  if (error) throw new Error('Failed to fetch attachments data.')

  const attachments = await Promise.all(
    data.map(async ({ id, original_filename }) => {
      const { data, error } = await getMeldingByMeldingIdAttachmentByAttachmentIdDownload({
        path: { attachment_id: id, melding_id: parseInt(meldingId, 10) },

        query: { token, type: 'thumbnail' },
      })

      if (error) throw new Error('Failed to fetch attachment download.')

      // Returning blob instead of File since the File api is not available in Node.js
      return {
        blob: data as Blob,
        fileName: original_filename,
      }
    }),
  )

  return { files: attachments, key: 'attachments', term: label }
}
