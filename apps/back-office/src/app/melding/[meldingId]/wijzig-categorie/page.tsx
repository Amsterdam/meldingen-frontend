import { redirect } from 'next/navigation'

import { getIsReclassificationNotAllowed } from '../_utils/getIsReclassificationNotAllowed'
import { ChangeCategory } from './ChangeCategory'
import { getClassification, getMeldingByMeldingId } from '~/app/_api-client/proxy'

type Params = {
  params: Promise<{ meldingId: string }>
}

export default async ({ params }: Params) => {
  const { meldingId } = await params

  const { data: melding, error: meldingError } = await getMeldingByMeldingId({
    path: { melding_id: Number(meldingId) },
  })

  if (meldingError) throw new Error('Failed to fetch melding data.')

  const isStateNotAllowed = getIsReclassificationNotAllowed(melding.state)

  if (isStateNotAllowed) {
    redirect(`/melding/${meldingId}`)
  }

  const { data: classifications, error: classificationsError } = await getClassification()

  if (classificationsError) throw new Error('Failed to fetch classifications.')

  return (
    <ChangeCategory
      classifications={classifications}
      meldingClassification={melding.classification}
      meldingId={Number(meldingId)}
      publicId={melding.public_id}
    />
  )
}
