import type { ReactNode } from 'react'

import NextLink from 'next/link'

import { Link } from '@meldingen/ui'

import type { MeldingWithAddress } from '../../Overview'
import type { OverviewField } from './getOverviewFieldLabel'

import { formatValue } from './formatValue'

export const renderOverviewFieldValue = (
  melding: MeldingWithAddress,
  field: OverviewField,
  t: (key: string) => string,
): ReactNode => {
  if (field.key === 'public_id') {
    return (
      <Link href={`/melding/${melding.id}`} linkComponent={NextLink}>
        {melding.public_id}
      </Link>
    )
  }

  if (field.key === 'days_open') {
    // TODO: Service level objective should always be filled.
    // Remove the guard when the BE has made that change.
    const serviceLevelObjective = melding.service_level_objective

    if (!serviceLevelObjective) {
      return ''
    }

    const { days, days_passed } = serviceLevelObjective

    const isOverdue = days_passed > days
    const label = `${days_passed}/${days}`

    return isOverdue ? <strong>{label}</strong> : label
  }

  return formatValue(melding, field.key, t)
}
