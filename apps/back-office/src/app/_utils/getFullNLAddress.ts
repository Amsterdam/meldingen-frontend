import type { MeldingOutput } from '~/apiClientProxy'

import { getShortNLAddress } from './getShortNLAddress'

type FullAddressInput = Pick<
  MeldingOutput,
  'street' | 'house_number' | 'house_number_addition' | 'postal_code' | 'city'
>

export const getFullNLAddress = ({
  city,
  house_number,
  house_number_addition,
  postal_code,
  street,
}: FullAddressInput) => {
  const shortAddress = getShortNLAddress({ house_number, house_number_addition, street })

  if (!shortAddress || !postal_code || !city) return undefined

  return `${shortAddress}, ${postal_code} ${city}`
}
