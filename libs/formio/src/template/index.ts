import { button } from './button'
import { component } from './component'
import { field } from './field'
import { html } from './html'
import { input } from './input'
import { label } from './label'
import { webform } from './webform'

export const template = {
  button: {
    form: button,
  },
  component: {
    form: component,
  },
  cssClasses: {
    'form-group': 'ams-field',
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
  webform: {
    form: webform,
  },
}
