import type { useTranslations } from 'next-intl'

import type { Coordinates } from '~/types'

export type AddressArgType = {
  coordinates: Coordinates
  setAddress: (address: string) => void
  signal: AbortSignal
  t: ReturnType<typeof useTranslations>
}

export const fetchAndSetAddress = async ({ coordinates: { lat, lng }, setAddress, signal, t }: AddressArgType) => {
  try {
    const response = await fetch(
      `https://api.pdok.nl/bzk/locatieserver/search/v3_1/reverse?lat=${lat}&lon=${lng}&rows=1&distance=30`,
      { signal },
    )

    if (!response.ok) {
      throw new Error('Unable to fetch address from coordinates from PDOK')
    }

    const result = await response.json()

    const address = result.response.docs?.[0]?.weergavenaam ?? t('no-address')

    setAddress(address)
  } catch (error) {
    // An aborted request has been superseded by a newer one, so it should not touch the address
    if (signal.aborted) return

    // eslint-disable-next-line no-console
    console.error(error)
    setAddress(t('no-address'))
  }
}
