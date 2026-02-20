import { Components } from '@formio/js'

import { editForm } from './editForm'

// import { editForm } from './editForm'

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
      <div class="time-component">
        <input
          ref="input"
          type="time"
          class="form-control"
          placeholder="${this.component.placeholder || ''}"
          ${this.component.disabled ? 'disabled' : ''}
        />
      </div>
    `)
  }
}
