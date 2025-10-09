import { MeldingOutput } from '@meldingen/api-client'

export const formatAddressFromMeldingData = (meldingData: MeldingOutput) => {
  const { street, house_number, house_number_addition, postal_code, city } = meldingData

  return `${street ?? ''} ${house_number ?? ''}${house_number_addition ?? ''}, ${postal_code ?? ''} ${
    city ?? ''
  }`.trim()
}
