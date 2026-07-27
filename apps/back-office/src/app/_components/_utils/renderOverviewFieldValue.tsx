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

  return formatValue(melding, field.key, t)
}
