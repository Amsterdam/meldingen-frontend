import { getTranslations } from 'next-intl/server'

import { Detail } from './Detail'
import { getMeldingByMeldingId, MeldingOutput } from 'apps/back-office/src/apiClientProxy'

export const generateMetadata = async ({ params }: { params: Promise<{ meldingId: number }> }) => {
  const { meldingId } = await params
  const t = await getTranslations('detail')

  return {
    description: t('metadata.title', { meldingId }),
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatMeldingData = (data: MeldingOutput, t: any) => {
  if (!data) return []

  return [
    {
      key: 'melding_id',
      label: t('subheading.melding-id'),
      value: String(data.id),
    },
    {
      key: 'created_at',
      label: t('subheading.created-at'),
      value: String(data.created_at),
    },
    {
      key: 'classification',
      label: t('subheading.classification'),
      value: String(data.classification),
    },
    {
      key: 'state',
      label: t('subheading.status'),
      value: String(data.state),
    },
    {
      key: 'geo_location',
      label: t('subheading.location'),
      value: String(data.geo_location),
    },
  ]
}

export default async ({ params }: { params: Promise<{ meldingId: number }> }) => {
  const t = await getTranslations('detail')
  const { meldingId } = await params

  const { data, error } = await getMeldingByMeldingId({ path: { melding_id: meldingId } })

  if (error || !data) {
    return 'An error occurred'
  }

  return <Detail meldingData={formatMeldingData(data, t)} />
}
