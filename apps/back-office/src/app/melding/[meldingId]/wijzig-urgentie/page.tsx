import { ChangeUrgency } from './ChangeUrgency'
import { getMeldingByMeldingId } from '~/apiClientProxy'

type Params = {
  params: Promise<{ meldingId: number }>
}

export default async ({ params }: Params) => {
  const { meldingId } = await params

  const { data, error } = await getMeldingByMeldingId({ path: { melding_id: meldingId } })

  if (error) throw new Error('Failed to fetch melding data.')

  return <ChangeUrgency currentUrgency={data.urgency} meldingId={meldingId} publicId={data.public_id} />
}
