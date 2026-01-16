import { useTranslations } from 'next-intl'

import { PDOKItem } from './types'
import { Coordinates } from 'apps/melding-form/src/types'

const pdokQueryParams =
  'fq=bron:BAG&fq=type:adres&fq=gemeentenaam:(amsterdam "ouder-amstel" weesp)&fl=id,weergavenaam,centroide_ll&rows=7'

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const debounce = (fn: Function, delay = 250) => {
  let timer: ReturnType<typeof setTimeout>

  return (...args: unknown[]) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

export type AddressArgType = {
  coordinates: Coordinates
  setAddress: (address: string) => void
  t: ReturnType<typeof useTranslations>
}

export const fetchAndSetAddress = async ({ coordinates: { lat, lng }, setAddress, t }: AddressArgType) => {
  try {
    const response = await fetch(
      `https://api.pdok.nl/bzk/locatieserver/search/v3_1/reverse?lat=${lat}&lon=${lng}&rows=1&distance=30`,
    )

    if (!response.ok) {
      throw new Error(t('errors.pdok-reverse-api-error'))
    }

    const result = await response.json()
    const address = result.response.docs?.[0]?.weergavenaam ?? t('combo-box.no-address')

    setAddress(address)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    setAddress(t('combo-box.no-address'))
  }
}

export type AddressListArgType = {
  setAddressList: (list: PDOKItem[]) => void
  setShowListBox: (show: boolean) => void
  t: ReturnType<typeof useTranslations>
  value: string
}

export const fetchAddressList = async ({ setAddressList, setShowListBox, t, value }: AddressListArgType) => {
  if (value.length < 3) {
    setShowListBox(false)
    setAddressList([])
    return
  }

  try {
    const response = await fetch(
      `https://api.pdok.nl/bzk/locatieserver/search/v3_1/suggest?${pdokQueryParams}&q=${value}`,
    )

    if (!response.ok) {
      throw new Error(t('errors.pdok-suggest-api-error'))
    }

    const result = await response.json()

    setAddressList(result.response.docs)
    setShowListBox(true)
  } catch (error) {
    // Only log the error, the user can continue without suggestions
    // eslint-disable-next-line no-console
    console.error(error)
  }
}
