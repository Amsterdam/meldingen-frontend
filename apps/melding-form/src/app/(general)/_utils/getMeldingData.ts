import { getMeldingByMeldingIdMelder } from '@meldingen/api-client'

export const getMeldingData = async (meldingId: string, token: string) => {
  const { data, error } = await getMeldingByMeldingIdMelder({
    path: { melding_id: parseInt(meldingId, 10) },
    query: { token },
  })

  if (error) throw new Error('Failed to fetch melding data.')
  if (!data) throw new Error('Melding data not found.')

  return { data }
}
