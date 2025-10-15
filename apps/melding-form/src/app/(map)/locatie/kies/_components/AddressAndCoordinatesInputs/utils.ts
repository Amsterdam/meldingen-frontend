import { useTranslations } from 'next-intl'

import { PDOKItem } from './types'
import { getAddressFromCoordinates } from '../../_utils'
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

export const fetchAndSetAddress = async (
  { lat, lng }: Coordinates,
  setAddress: (address: string) => void,
  t: ReturnType<typeof useTranslations>,
) => {
  try {
    const result = await getAddressFromCoordinates({ lat, lng })
    setAddress(result || t('no-address'))
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
  }
}

export const fetchAddressList = async (
  value: string,
  setAddressList: (list: PDOKItem[]) => void,
  setShowListBox: (show: boolean) => void,
) => {
  if (value.length < 3) {
    setShowListBox(false)
    setAddressList([])
    return
  }

  try {
    const response = await fetch(
      `https://api.pdok.nl/bzk/locatieserver/search/v3_1/suggest?${pdokQueryParams}&q=${value}`,
    )
    const responseData = await response.json()
    if (response.ok) {
      const responseList: PDOKItem[] = responseData.response.docs.map(
        (item: { id: string; weergavenaam: string; centroide_ll: string }): PDOKItem => ({
          id: item.id,
          weergave_naam: item.weergavenaam,
          centroide_ll: item.centroide_ll,
        }),
      )

      setAddressList(responseList)
    }
    setShowListBox(true)
  } catch (error) {
    // TODO: do we want to show a message to the user here?
    // eslint-disable-next-line no-console
    console.error(error)
  }
}
