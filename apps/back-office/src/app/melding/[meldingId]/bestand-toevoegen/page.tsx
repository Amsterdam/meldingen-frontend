import { getTranslations } from 'next-intl/server'

import { getAttachmentsData } from '../_utils'
import { AddAttachment } from './AddAttachment'
import { getMeldingByMeldingId } from '~/app/_api-client/proxy'

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

  const attachments = await getAttachmentsData(meldingId, t)
  if ('error' in attachments) return attachments.error

  return <AddAttachment attachments={attachments} meldingId={meldingId} />
}
