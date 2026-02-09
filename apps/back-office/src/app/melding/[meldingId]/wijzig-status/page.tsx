import { getTranslations } from 'next-intl/server'

import { ChangeState } from './ChangeState'
import { getMeldingByMeldingId, getMeldingByMeldingIdNextPossibleStates } from 'apps/back-office/src/apiClientProxy'

export const generateMetadata = async () => {
  const t = await getTranslations('change-state')

  return {
    title: t('metadata.title'),
  }
}

type Params = {
  params: Promise<{ meldingId: number }>
}

export default async ({ params }: Params) => {
  const { meldingId } = await params

  const { data, error } = await getMeldingByMeldingId({ path: { melding_id: meldingId } })

  if (error) throw new Error('Failed to fetch melding data.')

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
