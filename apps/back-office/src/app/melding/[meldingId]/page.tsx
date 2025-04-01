import { client } from 'libs/api-client/src/client.gen'
import { getServerSession } from 'next-auth'

import { getMeldingByMeldingId, MeldingOutput } from '@meldingen/api-client'

import { Detail } from './Detail'
import { authOptions } from '../../_authentication/authOptions'

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

  const session = await getServerSession(authOptions)

  if (!session?.accessToken) return undefined

  client.setConfig({
    auth: () => session.accessToken,
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
  })

  const { data, error } = await getMeldingByMeldingId({ path: { melding_id: meldingId } })

  if (error || !data) {
    return 'An error occurred'
  }

  return <Detail meldingData={formatMeldingData(data)} />
}
