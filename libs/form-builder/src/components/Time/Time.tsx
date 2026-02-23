import { Components } from '@formio/js'

import { editForm } from './editForm'

import './time.css'

const FormioComponent = Components.components.component

export class Time extends FormioComponent {
  static editForm = editForm

  static get builderInfo() {
    return {
      group: 'basic',
      icon: 'clock',
      schema: Time.schema(),
      title: 'Time',
      weight: 70,
    }
  }

  static schema() {
    return FormioComponent.schema({
      key: 'time',
      label: 'Time',
      type: 'time',
    })
  }

  render() {
    return super.render(`
        <input
          ref="input"
          type="time"
          class="time-component"
        />
    `)
  }
}
