import type { MeldingOutput } from 'apps/back-office/src/apiClientProxy'

import type { MeldingWithAddress } from '../../Overview'

export const OVERVIEW_FIELDS = [
  { key: 'public_id', labelKey: 'column-header.public_id' },
  { key: 'created_at', labelKey: 'column-header.created_at' },
  { key: 'classification', labelKey: 'column-header.classification' },
  { key: 'state', labelKey: 'column-header.state' },
  { key: 'address', labelKey: 'column-header.address' },
  { key: 'postal_code', labelKey: 'column-header.postal_code' },
] as const

export type OverviewFieldKey = (typeof OVERVIEW_FIELDS)[number]['key']

export const getMeldingDetailHref = (melding: Pick<MeldingOutput, 'id' | 'public_id'>) =>
  `/melding/${melding.id}?id=${melding.public_id}`

export const formatValue = (
  melding: MeldingWithAddress,
  key: OverviewFieldKey | string,
  t: (key: string) => string,
) => {
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
    default:
      return undefined
  }
}
