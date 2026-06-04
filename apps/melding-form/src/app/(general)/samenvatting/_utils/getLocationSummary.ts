import type { MeldingOutput } from '@meldingen/api-client'

import { getFullNLAddress } from '../../_utils/getFullNLAddress'

export const getLocationSummary = (t: (key: string) => string, meldingData: MeldingOutput) => {
  const address = getFullNLAddress(meldingData) || t('errors.no-location')

  return {
    description: address,
    key: 'location',
    term: t('location-label'),
  }
}
