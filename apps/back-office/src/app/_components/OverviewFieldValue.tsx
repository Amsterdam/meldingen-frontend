import { useTranslations } from 'next-intl'
import NextLink from 'next/link'

import { Link } from '@meldingen/ui'
import { formatDateString } from '@meldingen/utils'

import type { MeldingWithAddress } from '../Overview'
import type { OverviewField } from './_utils/getOverviewFieldLabel'

type Props = {
  field: OverviewField
  melding: MeldingWithAddress
}

const renderDaysOpen = (melding: MeldingWithAddress) => {
  // TODO: Service level objective should always be filled.
  // Remove the guard when the BE has made that change.
  const serviceLevelObjective = melding.service_level_objective

  if (!serviceLevelObjective) {
    return null
  }

  const { days, days_passed } = serviceLevelObjective

  const isOverdue = days_passed > days
  const label = `${days_passed}/${days}`

  return isOverdue ? <strong>{label}</strong> : label
}

export const OverviewFieldValue = ({ field, melding }: Props) => {
  const t = useTranslations()

  switch (field.key) {
    case 'address':
      return melding.address
    case 'classification':
      return melding.classification ? melding.classification.name : t('overview.no-classification')
    case 'created_at':
      return formatDateString(melding.created_at).date
    case 'days_open':
      return renderDaysOpen(melding)
    case 'postal_code':
      return melding.postal_code
    case 'public_id':
      return (
        <Link href={`/melding/${melding.id}`} linkComponent={NextLink}>
          {melding.public_id}
        </Link>
      )
    case 'state':
      return t(`shared.state.${melding.state}`)
    case 'urgency':
      return t(`shared.urgency.${melding.urgency}`)

    default: {
      const _exhaustive: never = field

      return null
    }
  }
}
