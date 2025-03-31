import type { StaticFormOutput, StaticFormTextAreaComponentOutput } from '@meldingen/api-client'

export const isTypeTextAreaComponent = (
  component: StaticFormOutput['components'][number],
): component is StaticFormTextAreaComponentOutput => component.type === 'textarea'
