import { Components } from '@formio/js'

import { editForm } from './editForm'

const FormioComponent = Components.components.component

export class Date extends FormioComponent {
  static editForm = editForm

  static get builderInfo() {
    return {
      group: 'basic',
      icon: 'calendar',
      schema: Date.schema(),
      title: 'Date',
    }
  }

  static schema() {
    return FormioComponent.schema({
      key: 'date',
      label: 'Date',
      type: 'date',
    })
  }

  render() {
    return super.render(`
    ${this.renderTemplate('label', {
      component: this.component,
      label: this.component.label,
    })}
  `)
  }
}
