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

export type PropsAddress = {
  coordinates: Coordinates
  setAddress: (address: string) => void
  setErrorMessage: (message?: string) => void
  t: ReturnType<typeof useTranslations>
}

export const fetchAndSetAddress = async ({
  coordinates: { lat, lng },
  setAddress,
  setErrorMessage,
  t,
}: PropsAddress) => {
  try {
    const response = await fetch(
      `https://api.pdok.nl/bzk/locatieserver/search/v3_1/reverse?lat=${lat}&lon=${lng}&rows=1&distance=30`,
    )

    if (!response.ok) {
      throw new Error(response.statusText)
    }

    setErrorMessage(undefined)
    const result = await response.json()
    const address = result.response.docs?.[0]?.weergavenaam ?? t('no-address')

    setAddress(address)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)

    setAddress(t('no-address'))
    setErrorMessage(t('pdok-reverse-coordinates-failed'))
  }
}

export type PropsAddressList = {
  setAddressList: (list: PDOKItem[]) => void
  setShowListBox: (show: boolean) => void
  value: string
}

export const fetchAddressList = async ({ setAddressList, setShowListBox, value }: PropsAddressList) => {
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
      throw new Error(response.statusText)
    }

    const result = await response.json()
    const addressList: PDOKItem[] = result.response.docs.map(
      (item: { centroide_ll: string; id: string; weergavenaam: string }): PDOKItem => ({
        centroide_ll: item.centroide_ll,
        id: item.id,
        weergave_naam: item.weergavenaam,
      }),
    )

    setAddressList(addressList)
    setShowListBox(true)
  } catch (error) {
    // Only log the error, the user can continue without suggestions
    // eslint-disable-next-line no-console
    console.error(error)
  }
}
