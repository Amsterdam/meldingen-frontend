import { getTranslations } from 'next-intl/server'

import type { OVERVIEW_FIELDS } from '../../constants'

export type OverviewField = (typeof OVERVIEW_FIELDS)[number]

export const getOverviewFieldLabel = async (field: OverviewField) => {
  const t = await getTranslations()

  return t(`overview.${field.labelKey}`)
}
