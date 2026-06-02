import type { MeldingOutput } from '~/apiClientProxy'

type ShortAddressInput = Pick<MeldingOutput, 'street' | 'house_number' | 'house_number_addition'>

export const getShortNLAddress = ({ house_number, house_number_addition, street }: ShortAddressInput) => {
  if (!street || !house_number) return undefined

  const addition = house_number_addition ? house_number_addition : ''

  return `${street} ${house_number}${addition}`
}
