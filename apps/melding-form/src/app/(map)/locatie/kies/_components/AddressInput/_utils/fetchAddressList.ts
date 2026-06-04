import type { PDOKItem } from '../types'

const pdokQueryParams =
  'fq=bron:BAG&fq=type:adres&fq=gemeentenaam:(amsterdam "ouder-amstel" weesp)&fl=id,weergavenaam,centroide_ll&rows=7'

export type AddressListArgType = {
  setAddressList: (list: PDOKItem[]) => void
  setShowListBox: (show: boolean) => void
  value: string
}

export const fetchAddressList = async ({ setAddressList, setShowListBox, value }: AddressListArgType) => {
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
      throw new Error('Unable to fetch address suggestions from PDOK')
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
