import { cookies } from 'next/headers'
import { getTranslations } from 'next-intl/server'

import { Attachments } from './Attachments'

export const generateMetadata = async () => {
  const t = await getTranslations('attachments')

  return {
    title: t('metadata.title'),
  }
}

export default async () => {
  const cookieStore = await cookies()
  const meldingId = cookieStore.get('id')?.value
  const token = cookieStore.get('token')?.value

  if (!meldingId || !token) return undefined

  return <Attachments meldingId={parseInt(meldingId, 10)} token={token} />
}
