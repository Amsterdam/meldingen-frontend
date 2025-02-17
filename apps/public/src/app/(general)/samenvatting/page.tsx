import type { Metadata } from 'next'
import { cookies } from 'next/headers'

import { getMeldingByMeldingIdAnswers, getMeldingByMeldingIdMelder } from 'apps/public/src/apiClientProxy'

import { getSummaryData } from './getSummaryData'
import { Summary } from './Summary'

export const metadata: Metadata = {
  title: 'Stap 4 van 4 - Samenvatting - Gemeente Amsterdam',
}

export type SummaryData = {
  key: string
  term: string
  description: string
}[]

export default async () => {
  // Get session variables from cookies
  const cookieStore = await cookies()
  const meldingId = cookieStore.get('id')?.value
  const token = cookieStore.get('token')?.value
  const location = cookieStore.get('location')?.value

  if (!meldingId || !token) return undefined

  const melding = await getMeldingByMeldingIdMelder({ meldingId: parseInt(meldingId, 10), token })

  const additionalQuestionsAnswers = await getMeldingByMeldingIdAnswers({ meldingId: parseInt(meldingId, 10), token })

  const data = getSummaryData({
    melding,
    additionalQuestionsAnswers,
    location: location ? JSON.parse(location) : undefined,
  }) as SummaryData

  return <Summary data={data} />
}
