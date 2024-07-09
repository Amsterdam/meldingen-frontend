import { component } from './component'
import { field } from './field'
import { html } from './html'
import { input } from './input'
import { label } from './label'
import { webform } from './webform'
import { wizard } from './wizard'
import { wizardNav } from './wizardNav'

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
  webform: {
    form: webform,
  },
  wizard: {
    form: wizard,
  },
  wizardNav: {
    form: wizardNav,
  },
}
