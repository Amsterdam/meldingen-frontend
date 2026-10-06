import type { PDOKItem } from '../types'

const pdokQueryParams =
  'fq=bron:BAG&fq=type:adres&fq=gemeentenaam:(amsterdam "ouder-amstel" weesp)&fl=id,weergavenaam,centroide_ll&rows=7'

export type AddressListArgType = {
  setAddressList: (list: PDOKItem[]) => void
  setShowListBox: (show: boolean) => void
  signal: AbortSignal
  value: string
}

export const fetchAddressList = async ({ setAddressList, setShowListBox, signal, value }: AddressListArgType) => {
  if (value.length < 3) {
    setShowListBox(false)
    setAddressList([])

    return
  }

  try {
    const response = await fetch(
      `https://api.pdok.nl/bzk/locatieserver/search/v3_1/suggest?${pdokQueryParams}&q=${value}`,
      { signal },
    )

    if (!response.ok) {
      throw new Error('Unable to fetch address suggestions from PDOK')
    }

    const result = await response.json()

    setAddressList(result.response.docs)
    setShowListBox(true)
  } catch (error) {
    // An aborted request has been superseded by a newer one, so it is not an error
    if (signal.aborted) return

    // Only log the error, the user can continue without suggestions
    // eslint-disable-next-line no-console
    console.error(error)
  }
}
