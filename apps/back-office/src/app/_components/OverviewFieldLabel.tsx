import { useTranslations } from 'next-intl'

import type { OverviewField } from '../constants'

type Props = {
  field: OverviewField
}

export const OverviewFieldLabel = ({ field }: Props) => {
  const t = useTranslations()

  return t(`overview.${field.labelKey}`)
}
