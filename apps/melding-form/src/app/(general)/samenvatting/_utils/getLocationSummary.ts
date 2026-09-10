import type { MeldingOutput } from '@meldingen/api-client'

import { getFullNLAddress } from '../../_utils/getFullNLAddress'

export const getLocationSummary = (t: (key: string) => string, meldingData: MeldingOutput) => {
  const address = getFullNLAddress(meldingData) || (meldingData.geo_location && t('no-address'))

  return {
    description: address ?? t('errors.no-location'),
    key: 'location',
    term: t('location-label'),
  }
}
