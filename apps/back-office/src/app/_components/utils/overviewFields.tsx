import type { ReactNode } from 'react'

import type { MeldingWithAddress } from '../../Overview'
import type { MeldingOutput } from 'apps/back-office/src/apiClientProxy'

import { AmsNextLink } from '../AmsNextLink'

export const OVERVIEW_FIELDS = [
  { key: 'public_id', labelKey: 'column-header.public_id' },
  { key: 'created_at', labelKey: 'column-header.created_at' },
  { key: 'classification', labelKey: 'column-header.classification' },
  { key: 'state', labelKey: 'column-header.state' },
  { key: 'urgency', labelKey: 'column-header.urgency' },
  { key: 'address', labelKey: 'column-header.address' },
  { key: 'postal_code', labelKey: 'column-header.postal_code' },
] as const

export type OverviewField = (typeof OVERVIEW_FIELDS)[number]

export const getMeldingDetailHref = (melding: Pick<MeldingOutput, 'id' | 'public_id'>) =>
  `/melding/${melding.id}?id=${melding.public_id}`

export const getOverviewFieldLabel = (field: OverviewField, t: (key: string) => string) =>
  t(`overview.${field.labelKey}`)

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
      return t(`shared.urgency.[${melding.urgency}]`)
    }
    default:
      return ''
  }
}

export const renderOverviewFieldValue = (
  melding: MeldingWithAddress,
  field: OverviewField,
  t: (key: string) => string,
): ReactNode => {
  if (field.key === 'public_id') {
    return (
      <AmsNextLink href={getMeldingDetailHref(melding)} variant="link">
        {melding.public_id}
      </AmsNextLink>
    )
  }

  return formatValue(melding, field.key, t)
}
