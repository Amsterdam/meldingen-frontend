import { getTranslations } from 'next-intl/server'

import { isFilePDF } from '../_utils'
import { Photos } from './Photos'
import { getAttachmentById, getMeldingByMeldingIdAttachments } from '~/app/_api-client/proxy'

type Props = PageProps<'/melding/[meldingId]/foto'>

export const generateMetadata = async () => {
  const t = await getTranslations('photos')

  return {
    title: t('metadata.title'),
  }
}

export default async ({ params, searchParams }: Props) => {
  const { meldingId: meldingIdParams } = await params
  const meldingId = Number(meldingIdParams)
  const { id: attachmentId } = await searchParams
  const attachmentIdString = Array.isArray(attachmentId) ? attachmentId[0] : attachmentId

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

  const attachmentIndex = images.findIndex((image) => image.id === Number(attachmentIdString))
  const defaultSlideIndex = attachmentIndex === -1 ? undefined : attachmentIndex

  return <Photos defaultSlideIndex={defaultSlideIndex} images={images} meldingId={meldingId} />
}
