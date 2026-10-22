import type { LabelOutput } from '~/app/_api-client/proxy'

import { ChangeLabels } from './ChangeLabels'
import { getLabel, getMeldingByMeldingId } from '~/app/_api-client/proxy'

type Props = Pick<PageProps<'/melding/[meldingId]/wijzig-labels'>, 'params'>

const getLabelIds = (labels: LabelOutput[]) => labels.map(({ id }) => id)

export default async ({ params }: Props) => {
  const { meldingId: meldingIdParams } = await params
  const meldingId = Number(meldingIdParams)

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
