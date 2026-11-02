import { getAttachmentsData } from '../_utils/server'
import { AddAttachment } from './AddAttachment'
import { getMeldingByMeldingId } from '~/app/_api-client/proxy'

type Props = Pick<PageProps<'/melding/[meldingId]/bestand-toevoegen'>, 'params'>

export default async ({ params }: Props) => {
  const { meldingId: meldingIdParams } = await params
  const meldingId = Number(meldingIdParams)

  const [{ data }, attachments] = await Promise.all([
    getMeldingByMeldingId({ path: { melding_id: meldingId } }),
    getAttachmentsData(meldingId, 'thumbnail'),
  ])

  return <AddAttachment attachments={attachments} meldingId={meldingId} publicId={data?.public_id ?? ''} />
}
