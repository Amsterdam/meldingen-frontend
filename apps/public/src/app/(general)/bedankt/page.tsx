import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { Bedankt } from './Bedankt'

export default async () => {
  const cookieStore = await cookies()

  const meldingId = cookieStore.get('id')?.value

  if (!meldingId) {
    redirect('/')
  }

  return <Bedankt meldingId={meldingId} />
}
