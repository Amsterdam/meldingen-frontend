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
  cssClasses: {
    'form-group': 'ams-field',
  },
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
  webform: {
    form: webform,
  },
}
