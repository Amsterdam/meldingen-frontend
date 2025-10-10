'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { putMeldingByMeldingIdSubmitLocation } from '@meldingen/api-client'

export const postLocationForm = async () => {
  const cookieStore = await cookies()

  const meldingId = cookieStore.get('id')?.value
  const token = cookieStore.get('token')?.value
  const address = cookieStore.get('address')?.value

  if (!meldingId || !token) return redirect('/cookie-storing')

  const t = await getTranslations('location')

  // Return validation error if coordinates are not supplied
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
  const { error: stateError } = await putMeldingByMeldingIdSubmitLocation({
    path: { melding_id: parseInt(meldingId, 10) },
    query: { token },
  })

  if (stateError) return { systemError: stateError }

  return redirect('/bijlage')
}
