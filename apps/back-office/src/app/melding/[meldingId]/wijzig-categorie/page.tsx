import { redirect } from 'next/navigation'

import { getIsReclassificationNotAllowed } from '../_utils/getIsReclassificationNotAllowed'
import { ChangeCategory } from './ChangeCategory'
import { getClassification, getMeldingByMeldingId } from '~/app/_api-client/proxy'

type Params = {
  params: Promise<{ meldingId: number }>
}

export default async ({ params }: Params) => {
  const { meldingId } = await params

  const { data: melding, error: meldingError } = await getMeldingByMeldingId({ path: { melding_id: meldingId } })

  if (meldingError) throw new Error('Failed to fetch melding data.')

  const { data: classifications, error: classificationsError } = await getClassification()

  if (classificationsError) throw new Error('Failed to fetch classifications.')

  const isStateNotAllowed = getIsReclassificationNotAllowed(melding.state)

  if (isStateNotAllowed) {
    redirect(`/melding/${meldingId}`)
  }

  return (
    <ChangeCategory
      classifications={classifications}
      meldingClassification={melding.classification}
      meldingId={meldingId}
      publicId={melding.public_id}
    />
  )
}
