import { Components } from '@formio/js'

import { editForm } from './editForm'

const FormioTime = Components.components.time

export class Time extends FormioTime {
  static editForm = editForm

  static get builderInfo() {
    return {
      group: 'basic',
      icon: 'clock',
      schema: Time.schema(),
      title: 'Time',
    }
  }
}
