import type { Metadata } from 'next'

import { Overview } from './Overview'
import { handleApiError } from '../handleApiError'
import { getMelding } from 'apps/back-office/src/apiClientProxy'

export const metadata: Metadata = {
  title: 'Overzicht meldingen openbare ruimte - Gemeente Amsterdam',
}

export default async () => {
  const { data, error } = await getMelding({ query: { limit: 10, sort: '["created_at","DESC"]' } })

  if (error || !data) return handleApiError(error)

  return <Overview data={data} />
}
