import { getTranslations } from 'next-intl/server'

import { getAttachmentsData } from '../_utils/server'
import { AddAttachment } from './AddAttachment'

type Props = Pick<PageProps<'/melding/[meldingId]/bestand-toevoegen'>, 'params'>

export const generateMetadata = async () => {
  const t = await getTranslations('add-attachment')

  return { title: t('metadata.title') }
}

export default async ({ params }: Props) => {
  const { meldingId: meldingIdParams } = await params
  const meldingId = Number(meldingIdParams)

  const attachments = await getAttachmentsData(meldingId, 'thumbnail')

  return <AddAttachment attachments={attachments} meldingId={meldingId} />
}
