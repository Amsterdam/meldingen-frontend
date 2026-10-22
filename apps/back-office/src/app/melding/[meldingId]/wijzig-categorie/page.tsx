import { redirect } from 'next/navigation'

import { isReclassificationAllowed } from '../_utils/server'
import { ChangeCategory } from './ChangeCategory'
import { getClassification, getMeldingByMeldingId } from '~/app/_api-client/proxy'

type Props = Pick<PageProps<'/melding/[meldingId]/wijzig-categorie'>, 'params'>

export default async ({ params }: Props) => {
  const { meldingId: meldingIdParams } = await params
  const meldingId = Number(meldingIdParams)

  const { data: melding, error: meldingError } = await getMeldingByMeldingId({
    path: { melding_id: meldingId },
  })

  if (meldingError) throw new Error('Failed to fetch melding data.')

  const { data: classifications, error: classificationsError } = await getClassification({ query: { limit: 0 } })

  if (classificationsError) throw new Error('Failed to fetch classifications.')

  const isStateAllowed = isReclassificationAllowed(melding.state)

  if (!isStateAllowed) {
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
