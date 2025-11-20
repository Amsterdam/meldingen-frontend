import { MeldingOutput } from 'apps/back-office/src/apiClientProxy'

type ShortAddressInput = Pick<MeldingOutput, 'street' | 'house_number' | 'house_number_addition'>
type FullAddressInput = Pick<
  MeldingOutput,
  'street' | 'house_number' | 'house_number_addition' | 'postal_code' | 'city'
>

export const getShortNLAddress = ({ house_number, house_number_addition, street }: ShortAddressInput) => {
  if (!street || !house_number) return undefined

  const addition = house_number_addition ? house_number_addition : ''

  return `${street} ${house_number}${addition}`
}

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
