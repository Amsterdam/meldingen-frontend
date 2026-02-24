import { Components } from '@formio/js'

import { editForm } from './editForm'

import './date.css'

const FormioComponent = Components.components.component

export class Date extends FormioComponent {
  static editForm = editForm

  static get builderInfo() {
    return {
      group: 'basic',
      icon: 'clock',
      schema: Date.schema(),
      title: 'Date',
      weight: 70,
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
        <div ref="component" class="formio-component-date" id="date-component">
            <label ref="label" for="date-component" class="col-form-label">Dag</label>
            <div ref="wrapper" class="form-radio radio">
            <div class="radio  form-check">
            <input class="form-check-input" ref="input" name="date" type="radio"  value="Vandaag" id="date-today" role="radio">
            <label  class="form-check-label" for="date-today"><span>Vandaag</span></label>
            </div>    
            <div class="radio  form-check">
            <input class="form-check-input" ref="input" name="date" type="radio"  value="Gisteren" id="date-yesterday" role="radio">
            <label  class="form-check-label" for="date-yesterday"><span>Gisteren</span></label>
            </div>
            <div class="radio  form-check">
            <input class="form-check-input" ref="input" name="date" type="radio"  value="Eergisteren" id="date-day-before-yesterday" role="radio">
            <label  class="form-check-label" for="date-day-before-yesterday"><span>01-01-2026</span></label>
            </div>
            </div>
        </div>
      `)
  }
}
