import { getTranslations } from 'next-intl/server'
import { cache } from 'react'

import { getMeldingByMeldingId } from '~/app/_api-client/proxy'

export const getMeldingTitle = cache(async (meldingId: string) => {
  const t = await getTranslations('detail')
  const { data } = await getMeldingByMeldingId({ path: { melding_id: Number(meldingId) } })

  return data?.public_id ? t('metadata.title', { publicId: data.public_id }) : t('metadata.title-fallback')
})
