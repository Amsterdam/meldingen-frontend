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

  if (!publicId) return undefined

  return <Thanks publicId={publicId} />
}
