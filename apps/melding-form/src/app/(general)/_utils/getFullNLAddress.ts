import { MeldingOutput } from '@meldingen/api-client'

type ShortAddressInput = Pick<MeldingOutput, 'street' | 'house_number' | 'house_number_addition'>
type FullAddressInput = Pick<
  MeldingOutput,
  'street' | 'house_number' | 'house_number_addition' | 'postal_code' | 'city'
>

/** This is a copy from the util in the backoffice */
const getShortNLAddress = ({ house_number, house_number_addition, street }: ShortAddressInput) => {
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
