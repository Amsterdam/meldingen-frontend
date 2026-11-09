import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'

import { getAttachmentsData } from '../_utils/server'
import { DeleteAttachment } from './DeleteAttachment'

type Props = Pick<PageProps<'/melding/[meldingId]/bestand-verwijderen'>, 'params'>

export const generateMetadata = async () => {
  const t = await getTranslations('remove-attachment')

  return { title: t('metadata.title') }
}

export default async ({ params }: Props) => {
  const { meldingId: meldingIdParams } = await params
  const meldingId = Number(meldingIdParams)

  const attachments = await getAttachmentsData(meldingId, 'optimized')

  if (attachments.length === 0) {
    redirect(`/melding/${meldingId}`)
  }

  return <DeleteAttachment attachments={attachments} meldingId={meldingId} />
}
