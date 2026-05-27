import type { LabelOutput } from '~/apiClientProxy'

import { ChangeLabels } from './ChangeLabels'
import { getLabel, getMeldingByMeldingId } from '~/apiClientProxy'

type Params = {
  params: Promise<{ meldingId: number }>
}

const getLabelIds = (labels: LabelOutput[]) => labels.map(({ id }) => id)

export default async ({ params }: Params) => {
  const { meldingId } = await params

  const { data, error } = await getMeldingByMeldingId({ path: { melding_id: meldingId } })

  if (error) throw new Error('Failed to fetch melding data.')

  const { data: labels, error: labelsError } = await getLabel()

  if (labelsError) throw new Error('Failed to fetch labels.')

  return (
    <ChangeLabels
      currentLabelIds={data.labels ? getLabelIds(data.labels) : undefined}
      labels={labels}
      meldingId={meldingId}
      publicId={data.public_id}
    />
  )
}
