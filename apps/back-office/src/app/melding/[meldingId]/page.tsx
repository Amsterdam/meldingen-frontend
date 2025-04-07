import { Detail } from './Detail'
import { getMeldingByMeldingId, MeldingOutput } from 'apps/back-office/src/apiClientProxy'

export const generateMetadata = async ({ params }: { params: Promise<{ meldingId: number }> }) => {
  const { meldingId } = await params

  return {
    title: `Melding ${meldingId} - Gemeente Amsterdam`,
  }
}

const formatMeldingData = (data: MeldingOutput) => {
  if (!data) return []

  return [
    {
      key: 'melding_id',
      label: 'Melding ID',
      value: String(data.id),
    },
    {
      key: 'created_at',
      label: 'Gemeld op',
      value: String(data.created_at),
    },
    {
      key: 'classification',
      label: 'Categorie',
      value: String(data.classification),
    },
    {
      key: 'state',
      label: 'Status',
      value: String(data.state),
    },
    {
      key: 'geo_location',
      label: 'Locatie',
      value: String(data.geo_location),
    },
  ]
}

export default async ({ params }: { params: Promise<{ meldingId: number }> }) => {
  const { meldingId } = await params

  const { data, error } = await getMeldingByMeldingId({ path: { melding_id: meldingId } })

  if (error || !data) {
    return 'An error occurred'
  }

  return <Detail meldingData={formatMeldingData(data)} />
}
