import { cookies } from 'next/headers'
import { getTranslations } from 'next-intl/server'

import { Thanks } from './Thanks'

export const generateMetadata = async () => {
  const t = await getTranslations('thanks')

  return {
    title: t('metadata.title'),
  }
}

export default async () => {
  const cookieStore = await cookies()

  const publicId = cookieStore.get('public_id')?.value
  const createdAt = cookieStore.get('created_at')?.value

  if (!publicId || !createdAt) return undefined

  const date = new Date(createdAt).toLocaleDateString('nl-NL')
  const time = new Date(createdAt).toLocaleTimeString('nl-NL', { timeStyle: 'short' })

  return <Thanks publicId={publicId} date={date} time={time} />
}
