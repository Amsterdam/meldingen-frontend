import { getTranslations } from 'next-intl/server'

import { getAttachmentsData } from '../_utils/server'
import { AddAttachment } from './AddAttachment'
import { getMeldingByMeldingId } from '~/app/_api-client/proxy'
import { handleApiError } from '~/app/_utils/handleApiError'

export const generateMetadata = async ({ params }: { params: Promise<{ meldingId: number }> }) => {
  const { meldingId } = await params

  const t = await getTranslations('add-attachment')

  const { data } = await getMeldingByMeldingId({ path: { melding_id: meldingId } })

  return {
    title: t('metadata.title', { publicId: data?.public_id ?? '' }),
  }
}

export default async ({ params }: { params: Promise<{ meldingId: number }> }) => {
  const { meldingId } = await params

  const t = await getTranslations()

  let attachmentFiles

  try {
    attachmentFiles = await getAttachmentsData(meldingId)
  } catch (error) {
    return typeof error === 'string' ? error : handleApiError(error)
  }

  const attachments = {
    attachments: attachmentFiles,
    key: 'attachments',
    term: t('detail.attachments.title'),
  }

  return <AddAttachment attachments={attachments} meldingId={meldingId} />
}
