import { getTranslations } from 'next-intl/server'

import { getAttachmentsData } from '../_utils/server'
import { AddAttachment } from './AddAttachment'
import { getMeldingByMeldingId } from '~/app/_api-client/proxy'

type Props = Pick<PageProps<'/melding/[meldingId]/bestand-toevoegen'>, 'params'>

export const generateMetadata = async ({ params }: Props) => {
  const { meldingId: meldingIdParams } = await params
  const meldingId = Number(meldingIdParams)

  const t = await getTranslations('add-attachment')

  const { data } = await getMeldingByMeldingId({ path: { melding_id: meldingId } })

  return {
    title: t('metadata.title', { publicId: data?.public_id ?? '' }),
  }
}

export default async ({ params }: Props) => {
  const { meldingId: meldingIdParams } = await params
  const meldingId = Number(meldingIdParams)

  const [{ data }, attachments] = await Promise.all([
    getMeldingByMeldingId({ path: { melding_id: meldingId } }),
    getAttachmentsData(meldingId, 'thumbnail'),
  ])

  return <AddAttachment attachments={attachments} meldingId={meldingId} publicId={data?.public_id ?? ''} />
}
