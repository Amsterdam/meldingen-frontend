'use server'

import { getTranslations } from 'next-intl/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { putMeldingByMeldingIdSubmitLocation } from '@meldingen/api-client'

import { COOKIES } from 'apps/melding-form/src/constants'

export const postLocationForm = async () => {
  const cookieStore = await cookies()

  const meldingId = cookieStore.get(COOKIES.ID)?.value
  const token = cookieStore.get(COOKIES.TOKEN)?.value
  const address = cookieStore.get(COOKIES.ADDRESS)?.value

  if (!meldingId || !token) return redirect('/cookie-storing')

  const t = await getTranslations('location')

  // Return validation error if address is not supplied
  if (!address) {
    return {
      validationErrors: [
        {
          key: 'location-link',
          message: t('errors.no-location'),
        },
      ],
    }
  }

  // Set melding state to 'location_submitted'
  const { error } = await putMeldingByMeldingIdSubmitLocation({
    path: { melding_id: parseInt(meldingId, 10) },
    query: { token },
  })

  if (error) return { systemError: error }

  return redirect('/bijlage')
}
