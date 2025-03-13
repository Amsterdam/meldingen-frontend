import type { StaticFormOutput, StaticFormTextAreaComponentOutput } from './apiClientProxy'

export const isTypeTextAreaComponent = (
  component: StaticFormOutput['components'][number],
): component is StaticFormTextAreaComponentOutput => component.type === 'textarea'
