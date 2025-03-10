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

  const meldingId = cookieStore.get('id')?.value

  if (!meldingId) return undefined

  return <Thanks meldingId={meldingId} />
}
