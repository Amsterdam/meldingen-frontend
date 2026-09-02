import { getTranslations } from 'next-intl/server'

import { getAttachmentsData } from '../_utils/server'
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

  const attachments = await getAttachmentsData(meldingId)

  //TODO show error as alert

  return <AddAttachment attachments={attachments.attachmentsWithFile} meldingId={meldingId} />
}
