import type { MeldingOutput } from '@meldingen/api-client'

export const COOKIES = {
  PAGE_SIZE: 'meldingen_bo_overview_page_size',
} as const

export const ALLOWED_PAGE_SIZES = [5, 10, 20, 40, 60] as const

export const DEFAULT_PAGE_SIZE = 10

export const SORT = '["created_at","DESC"]'

export const URGENCY_VALUES: readonly MeldingOutput['urgency'][] = [-1, 0, 1]
