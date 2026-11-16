import { getTranslations } from 'next-intl/server'

import { ChangeUrgency } from './ChangeUrgency'
import { getMeldingByMeldingId } from '~/app/_api-client/proxy'

type Props = Pick<PageProps<'/melding/[meldingId]/wijzig-urgentie'>, 'params'>

export const generateMetadata = async () => {
  const t = await getTranslations('change-urgency')

  return { title: t('metadata.title') }
}

export default async ({ params }: Props) => {
  const { meldingId: meldingIdParams } = await params
  const meldingId = Number(meldingIdParams)

  const { data, error } = await getMeldingByMeldingId({ path: { melding_id: meldingId } })

  if (error) throw new Error('Failed to fetch melding data.')

  return <ChangeUrgency currentUrgency={data.urgency} meldingId={meldingId} publicId={data.public_id} />
}
