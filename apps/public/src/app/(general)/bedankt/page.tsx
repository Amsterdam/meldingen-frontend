import { cookies } from 'next/headers'

import { Bedankt } from './Bedankt'

export default async () => {
  const cookieStore = await cookies()

  const meldingId = cookieStore.get('id')?.value

  if (!meldingId) return null

  return <Bedankt meldingId={meldingId} />
}
