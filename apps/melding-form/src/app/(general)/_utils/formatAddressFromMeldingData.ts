import { MeldingOutput } from '@meldingen/api-client'

export const formatAddressFromMeldingData = (meldingData: MeldingOutput) => {
  const { street, house_number, house_number_addition, postal_code, city } = meldingData

  const numberPart = house_number ? `${house_number}${house_number_addition ?? ''}` : ''
  const streetPart = [street, numberPart].filter(Boolean).join(' ')
  const postalPart = [postal_code, city].filter(Boolean).join(' ')
  const parts = [streetPart, postalPart].filter(Boolean)

  return parts.join(', ').trim()
}
