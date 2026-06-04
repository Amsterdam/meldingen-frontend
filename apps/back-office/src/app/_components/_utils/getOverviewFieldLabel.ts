import type { OVERVIEW_FIELDS } from '../../constants'

export type OverviewField = (typeof OVERVIEW_FIELDS)[number]

export const getOverviewFieldLabel = (field: OverviewField, t: (key: string) => string) =>
  t(`overview.${field.labelKey}`)
