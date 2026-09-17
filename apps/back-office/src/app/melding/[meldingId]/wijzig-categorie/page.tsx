import { redirect } from 'next/navigation'

import { getIsReclassificationAllowed } from '../_utils/server'
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

  const { data: classifications, error: classificationsError } = await getClassification()

  if (classificationsError) throw new Error('Failed to fetch classifications.')

  const isStateAllowed = getIsReclassificationAllowed(melding.state)

  if (!isStateAllowed) {
    redirect(`/melding/${meldingId}`)
  }

  return (
    <ChangeCategory
      classifications={classifications}
      meldingClassification={melding.classification}
      meldingId={Number(meldingId)}
      publicId={melding.public_id}
    />
  )
}
