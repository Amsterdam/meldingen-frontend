import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'

import type { LabelOutput } from '~/app/_api-client/proxy'

import { ChangeLabels } from './ChangeLabels'
import { getLabel, getMeldingByMeldingId } from '~/app/_api-client/proxy'

type Props = Pick<PageProps<'/melding/[meldingId]/wijzig-labels'>, 'params'>

const getLabelIds = (labels: LabelOutput[]) => labels.map(({ id }) => id)

export const generateMetadata = async () => {
  const t = await getTranslations('change-labels')

  return { title: t('metadata.title') }
}

export default async ({ params }: Props) => {
  const { meldingId: meldingIdParams } = await params
  const meldingId = Number(meldingIdParams)

  const { data, error, response } = await getMeldingByMeldingId({ path: { melding_id: meldingId } })

  if (response?.status === 404) notFound()

  if (error) throw new Error('Failed to fetch melding data.', { cause: error })

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
