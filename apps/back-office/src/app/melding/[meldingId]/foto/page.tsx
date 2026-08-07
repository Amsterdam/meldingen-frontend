import { getTranslations } from 'next-intl/server'

import { Photos } from './Photos'
import { getAttachmentById, getMeldingByMeldingIdAttachments } from '~/app/_api-client/proxy'

export const generateMetadata = async () => {
  const t = await getTranslations('photos')

  return {
    title: t('metadata.title'),
  }
}

type Params = {
  params: Promise<{ meldingId: number }>
}

export default async ({ params }: Params) => {
  const { meldingId } = await params

  const { data, error } = await getMeldingByMeldingIdAttachments({ path: { melding_id: meldingId } })

  if (error) throw new Error('Failed to fetch melding attachments.')

  const images = await Promise.all(
    data.map(async ({ created_at, id, original_filename }) => {
      const { data: imageData, error: imageDownloadError } = await getAttachmentById({
        path: { id },
      })

      if (imageDownloadError) throw new Error('Failed to download image.')

      return {
        createdAt: created_at,
        data: imageData,
        filename: original_filename,
        id,
      }
    }),
  )

  return <Photos images={images} meldingId={meldingId} />
}
