import { MeldingOutput } from '@meldingen/api-client'

type ShortAddressInput = Pick<MeldingOutput, 'street' | 'house_number' | 'house_number_addition'>
type FullAddressInput = Pick<
  MeldingOutput,
  'street' | 'house_number' | 'house_number_addition' | 'postal_code' | 'city'
>

/** This is a copy from the util in the backoffice */
const getShortNLAddress = ({ street, house_number, house_number_addition }: ShortAddressInput) => {
  if (!street || !house_number) return undefined

  const addition = house_number_addition ? house_number_addition : ''

  return `${street} ${house_number}${addition}`
}

export const getFullNLAddress = ({
  street,
  house_number,
  house_number_addition,
  postal_code,
  city,
}: FullAddressInput) => {
  const shortAddress = getShortNLAddress({ street, house_number, house_number_addition })

  if (!shortAddress || !postal_code || !city) return undefined

  return `${shortAddress}, ${postal_code} ${city}`
}
