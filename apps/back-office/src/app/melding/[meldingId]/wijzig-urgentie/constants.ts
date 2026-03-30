import type { MeldingOutput } from '@meldingen/api-client'

type Urgency = MeldingOutput['urgency']
type AllUrgencyValues<T extends readonly Urgency[]> = Urgency extends T[number] ? T : never

const asUrgencyValues = <T extends readonly Urgency[]>(arr: AllUrgencyValues<T> & T): T => arr

export const URGENCY_VALUES = asUrgencyValues([-1, 0, 1] as const)
