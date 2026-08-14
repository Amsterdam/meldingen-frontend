import { getTranslations } from 'next-intl/server'

import { getMeldingByMeldingId } from '@meldingen/api-client'

import { getAttachmentsData } from '../_utils'
import { AddAttachment } from './AddAttachment'

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

  const t = await getTranslations('add-attachment')

  const attachments = await getAttachmentsData(meldingId, t)
  if ('error' in attachments) return attachments.error

  return <AddAttachment attachments={attachments} meldingId={meldingId} />
}
