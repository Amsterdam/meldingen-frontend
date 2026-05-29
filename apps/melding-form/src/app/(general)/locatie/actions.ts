'use server'

import { getTranslations } from 'next-intl/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { COOKIES, TOP_ANCHOR_ID } from '~/constants'

export const postLocationForm = async () => {
  const cookieStore = await cookies()

  const meldingId = cookieStore.get(COOKIES.ID)?.value
  const token = cookieStore.get(COOKIES.TOKEN)?.value
  const address = cookieStore.get(COOKIES.ADDRESS)?.value

  if (!meldingId || !token) return redirect(`/cookie-storing#${TOP_ANCHOR_ID}`)

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

  return redirect(`/bijlage#${TOP_ANCHOR_ID}`)
}
