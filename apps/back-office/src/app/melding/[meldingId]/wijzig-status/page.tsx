import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'

import { ChangeState } from './ChangeState'
import { getMeldingByMeldingId, getMeldingByMeldingIdNextPossibleStates } from '~/app/_api-client/proxy'

type Props = Pick<PageProps<'/melding/[meldingId]/wijzig-status'>, 'params'>

export const generateMetadata = async () => {
  const t = await getTranslations('change-state')

  return { title: t('metadata.title') }
}

export default async ({ params }: Props) => {
  const { meldingId: meldingIdParams } = await params
  const meldingId = Number(meldingIdParams)

  const { data, error, response } = await getMeldingByMeldingId({ path: { melding_id: meldingId } })

  if (response?.status === 404) notFound()

  if (error) throw new Error('Failed to fetch melding data.', { cause: error })

  const { data: possibleStates, error: possibleStatesError } = await getMeldingByMeldingIdNextPossibleStates({
    path: { melding_id: meldingId },
  })

  if (possibleStatesError) throw new Error('Failed to fetch next possible states.')

  return (
    <ChangeState
      meldingId={meldingId}
      meldingState={data.state}
      possibleStates={possibleStates.states}
      publicId={data.public_id}
    />
  )
}
