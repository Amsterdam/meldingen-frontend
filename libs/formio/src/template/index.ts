import { button } from './button'
import { component } from './component'
import { field } from './field'
import { html } from './html'
import { input } from './input'
import { label } from './label'
import { radio } from './radio'
import { select } from './select'
import { selectOption } from './selectOption'
import { webform } from './webform'
import { wizard } from './wizard'
import { wizardNav } from './wizardNav'

export const template = {
  button: {
    form: button,
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
  radio: {
    form: radio,
  },
  select: {
    form: select,
  },
  selectOption: {
    form: selectOption,
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
