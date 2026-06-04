import type { MeldingWithAddress } from '../../Overview'
import type { OverviewField } from './getOverviewFieldLabel'

export const formatValue = (melding: MeldingWithAddress, key: OverviewField['key'], t: (key: string) => string) => {
  switch (key) {
    case 'address':
      return melding.address || ''
    case 'classification':
      return melding.classification ? melding.classification.name : t('overview.no-classification')
    case 'created_at':
      return new Date(melding.created_at).toLocaleDateString('nl-NL')
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
