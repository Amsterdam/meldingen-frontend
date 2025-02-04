import { getMeldingByMeldingIdAttachments } from '@meldingen/api-client'
import { cookies } from 'next/headers'

import { Samenvatting } from './Samenvatting'

export default async () => {
  console.log('Render page')
  const cookieStore = await cookies()

  const meldingId = cookieStore.get('id')?.value
  console.log('---  meldingId:', meldingId)
  const token = cookieStore.get('token')?.value
  console.log('---  token:', token)

  if (!meldingId || !token) return undefined

  const result = await getMeldingByMeldingIdAttachments({ meldingId: Number(meldingId), token })

  console.log('---  result:', result)
  return <Samenvatting />
}
