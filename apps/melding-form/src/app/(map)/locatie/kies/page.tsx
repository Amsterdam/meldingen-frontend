import { cookies } from 'next/headers'
import { getTranslations } from 'next-intl/server'

import { getMeldingByMeldingIdMelder } from '@meldingen/api-client'

import { SelectLocation } from './SelectLocation'
import { handleApiError } from 'apps/melding-form/src/handleApiError'

export const generateMetadata = async () => {
  const t = await getTranslations('select-location')

  return {
    title: t('metadata.title'),
  }
}

export default async () => {
  const cookieStore = await cookies()
  // We check for the existence of these cookies in our middleware, so non-null assertion is safe here.
  const meldingId = cookieStore.get('id')!.value
  const token = cookieStore.get('token')!.value

  const { data, error } = await getMeldingByMeldingIdMelder({
    path: {
      melding_id: parseInt(meldingId, 10),
    },
    query: { token },
  })

  if (error) throw new Error(handleApiError(error))

  return <SelectLocation classification={data?.classification?.name} />
}
