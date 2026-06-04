import type { MeldingOutput } from '@meldingen/api-client'

import { getFullNLAddress } from '~/app/_utils/getFullNLAddress'

export const getLocationData = (data: MeldingOutput, t: (key: string) => string) => {
  const address = getFullNLAddress(data)

  if (!address) return undefined

  return [
    {
      description: address,
      key: 'address',
      term: t('detail.location.address'),
    },
  ]
}
