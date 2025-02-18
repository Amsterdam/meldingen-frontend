import type { Metadata } from 'next'

import { Bijlage } from './Bijlage'
import { cookies } from 'next/headers'

export const metadata: Metadata = {
  title: 'Stap 2 van 4 - Foto’s - Gemeente Amsterdam',
}

export default async () => {
  const cookieStore = await cookies()
  const meldingId = cookieStore.get('id')?.value
  const token = cookieStore.get('token')?.value

  if (!meldingId || !token) return

  return <Bijlage meldingId={parseInt(meldingId, 10)} token={token} />
}
