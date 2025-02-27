import type { Metadata } from 'next'
import { cookies } from 'next/headers'

import { Thanks } from './Thanks'

export const metadata: Metadata = {
  title: 'Bedankt - Gemeente Amsterdam',
}

export default async () => {
  const cookieStore = await cookies()

  const meldingId = cookieStore.get('id')?.value

  if (!meldingId) return undefined

  return <Thanks meldingId={meldingId} />
}
