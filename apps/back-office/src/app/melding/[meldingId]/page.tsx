import { getTranslations } from 'next-intl/server'

import { Detail } from './Detail'
import { getMeldingByMeldingId, MeldingOutput } from 'apps/back-office/src/apiClientProxy'

export const generateMetadata = async ({ params }: { params: Promise<{ meldingId: number }> }) => {
  const { meldingId } = await params
  const t = await getTranslations('detail')

  return {
    title: t('metadata.title', { meldingId }),
  }
}

const formatMeldingData = async (data: MeldingOutput) => {
  const { id, created_at, classification, state, geo_location } = data

  const t = await getTranslations('detail.term')

  return [
    {
      key: 'melding_id',
      term: t('melding_id'),
      description: String(id),
    },
    {
      key: 'created_at',
      term: t('created_at'),
      description: new Date(created_at).toLocaleDateString('nl-NL'),
    },
    {
      key: 'classification',
      term: t('classification'),
      description: String(classification),
    },
    {
      key: 'state',
      term: t('state'),
      description: String(state),
    },
    {
      key: 'geo_location',
      term: t('geo_location'),
      description: String(geo_location),
    },
  ]
}

export default async ({ params }: { params: Promise<{ meldingId: number }> }) => {
  const { meldingId } = await params

  const { data, error } = await getMeldingByMeldingId({ path: { melding_id: meldingId } })

  const t = await getTranslations('detail.errors')

  if (error || !data) {
    return t('melding-not-found')
  }

  const formattedData = await formatMeldingData(data)

  return <Detail meldingData={formattedData} meldingId={data.id} meldingState={data.state} />
}
