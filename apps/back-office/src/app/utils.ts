import { MeldingOutput } from 'apps/back-office/src/apiClientProxy'

type FormatNLAddressArgs = Pick<MeldingOutput, 'street' | 'house_number' | 'house_number_addition'>

export const formatNLAddress = ({ street, house_number, house_number_addition }: FormatNLAddressArgs) => {
  if (!street || !house_number) {
    return null
  }

  return `${street} ${house_number}${house_number_addition ? `${house_number_addition}` : ''}`
}
