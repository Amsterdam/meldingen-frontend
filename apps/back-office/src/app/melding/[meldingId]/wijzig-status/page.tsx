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

  const t = await getTranslations('change-state.errors')

  if (error) {
    return t('melding-not-found')
  }

  const { data: possibleStates, error: possibleStatesError } = await getMeldingByMeldingIdNextPossibleStates({
    path: { melding_id: meldingId },
  })

  if (possibleStatesError) {
    return 'possible-states-not-found' // TODO
  }

  return (
    <ChangeState
      meldingId={meldingId}
      meldingState={data.state}
      possibleStates={possibleStates.states}
      publicId={data.public_id}
    />
  )
}
