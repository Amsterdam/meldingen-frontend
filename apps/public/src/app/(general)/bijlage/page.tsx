import type { Metadata } from 'next'
import { cookies } from 'next/headers'

import { Attachments } from './Attachments'

export const metadata: Metadata = {
  title: 'Stap 2 van 4 - Foto’s - Gemeente Amsterdam',
}

export default async () => {
  const cookieStore = await cookies()
  const meldingId = cookieStore.get('id')?.value
  const token = cookieStore.get('token')?.value

  if (!meldingId || !token) return undefined

  return <Attachments meldingId={parseInt(meldingId, 10)} token={token} />
}
