import { component } from './component'
import { field } from './field'
import { html } from './html'
import { input } from './input'
import { label } from './label'

export { component, field, html, input, label }

export const template = {
  component: {
    form: component,
  },
  field: {
    form: field,
  },
  html: {
    form: html,
  },
  input: {
    form: input,
  },
  label: {
    form: label,
  },
}
