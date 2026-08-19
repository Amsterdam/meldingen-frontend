import type { MeldingWithAddress } from '../../Overview'
import type { OverviewField } from './getOverviewFieldLabel'

import { formatDateString } from '~/app/_utils/formatDateString'

export const formatValue = (melding: MeldingWithAddress, key: OverviewField['key'], t: (key: string) => string) => {
  switch (key) {
    case 'address':
      return melding.address || ''
    case 'classification':
      return melding.classification ? melding.classification.name : t('overview.no-classification')
    case 'created_at':
      return formatDateString(melding.created_at).date
    case 'postal_code':
      return melding.postal_code || ''
    case 'public_id':
      return melding.public_id
    case 'state':
      return t(`shared.state.${melding.state}`)
    case 'urgency': {
      return t(`shared.urgency.${melding.urgency}`)
    }
    default:
      return ''
  }
}
