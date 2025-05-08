import { getTranslations } from 'next-intl/server'

import { ChangeState } from './ChangeState'
import { getMeldingByMeldingId } from 'apps/back-office/src/apiClientProxy'

export const generateMetadata = async () => {
  const t = await getTranslations('change-state')

  return {
    title: t('metadata.title'),
  }
}

export default async ({ params }: { params: Promise<{ meldingId: number }> }) => {
  const { meldingId } = await params

  const { data, error } = await getMeldingByMeldingId({ path: { melding_id: meldingId } })

  const t = await getTranslations('change-state.errors')

  if (error || !data) {
    return t('melding-not-found')
  }

  return <ChangeState meldingId={meldingId} meldingState={data.state} />
}
