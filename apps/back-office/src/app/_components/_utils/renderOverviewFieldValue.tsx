import type { ReactNode } from 'react'

import type { MeldingWithAddress } from '../../Overview'
import type { OverviewField } from './getOverviewFieldLabel'

import { AmsNextLink } from '../AmsNextLink'
import { formatValue } from './formatValue'

export const renderOverviewFieldValue = (
  melding: MeldingWithAddress,
  field: OverviewField,
  t: (key: string) => string,
): ReactNode => {
  if (field.key === 'public_id') {
    return (
      <AmsNextLink href={`/melding/${melding.id}`} variant="link">
        {melding.public_id}
      </AmsNextLink>
    )
  }

  return formatValue(melding, field.key, t)
}
