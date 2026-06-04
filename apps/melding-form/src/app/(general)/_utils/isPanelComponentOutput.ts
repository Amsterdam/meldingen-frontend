import type { FormOutput, FormPanelComponentOutput } from '@meldingen/api-client'

export const isPanelComponentOutput = (
  component: FormOutput['components'][number],
): component is FormPanelComponentOutput => component.type === 'panel'
