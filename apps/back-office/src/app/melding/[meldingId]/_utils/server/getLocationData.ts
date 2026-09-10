import type { MeldingOutput } from '@meldingen/api-client'

import { getFullNLAddress } from '~/app/_utils/getFullNLAddress'

export const getLocationData = (data: MeldingOutput, t: (key: string) => string) => {
  const address = getFullNLAddress(data)

  return [
    {
      description: address ?? t('detail.location.no-address'),
      key: 'address',
      term: t('detail.location.address'),
    },
  ]
}
