import { getTranslations } from 'next-intl/server'

import { isFilePDF } from '../_utils'
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
  searchParams: Promise<{ id?: string }>
}

export default async ({ params, searchParams }: Params) => {
  const { meldingId } = await params
  const { id: attachmentIdString } = await searchParams

  const { data, error } = await getMeldingByMeldingIdAttachments({ path: { melding_id: meldingId } })

  if (error) throw new Error('Failed to fetch melding attachments.')

  const images = await Promise.all(
    data
      .filter(({ original_filename }) => !isFilePDF(original_filename))
      .map(async ({ created_at, id, original_filename }) => {
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

  const attachmentId = attachmentIdString ? parseInt(attachmentIdString, 10) : undefined
  const attachmentIndex = images.findIndex((image) => image.id === attachmentId)
  const defaultSlideIndex = attachmentIndex === -1 ? undefined : attachmentIndex

  return <Photos defaultSlideIndex={defaultSlideIndex} images={images} meldingId={meldingId} />
}
