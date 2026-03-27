import type { MeldingOutput } from '@meldingen/api-client'

export const URGENCY_VALUES: MeldingOutput['urgency'][] = [-1, 0, 1] as const

export const URGENCY_OPTIONS = [
  { labelKey: 'urgency.[-1]', urgency: -1 },
  { labelKey: 'urgency.[0]', urgency: 0 },
  { labelKey: 'urgency.[1]', urgency: 1 },
] as const satisfies readonly {
  labelKey: `urgency.[${MeldingOutput['urgency']}]`
  urgency: MeldingOutput['urgency']
}[]
