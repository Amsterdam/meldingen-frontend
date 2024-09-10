import { Components } from '@formio/react'

import { editForm } from './editForm'

const FormioTextarea = (Components as any).components.textarea

export class Textarea extends FormioTextarea {
  get inputInfo() {
    const inputInfo = super.inputInfo

    inputInfo.attr.class = 'ams-text-area'
    inputInfo.attr.dir = 'auto'

    return inputInfo
  }

  static editForm = editForm

  setCounter(element: HTMLElement, count: number, max: number) {
    if (max) {
      const remaining = max - count
      if (remaining > 0) {
        this.removeClass(element, 'ams-character-count--error')
      } else {
        this.addClass(element, 'ams-character-count--error')
      }
      this.setContent(element, `${count} van ${max} tekens`)
    } else {
      this.setContent(element, `${count} tekens`)
    }
  }

  updateValueAt(value: string, index: number) {
    // TODO: this should check for maxCharCount
    if (this.component?.showCharCount) {
      if (this.refs.charcount && this.refs.charcount[index]) {
        // const maxChars = _.parseInt(_.get(this.component, 'validate.maxLength', 0), 10)
        this.setCounter(this.refs.charcount[index], value.length, 1000) // TODO: 1000 should be maxCharCount
      }
    }
  }

  updateValue(value: string, _: unknown, index: number) {
    const changed = super.updateValue(value)
    this.triggerUpdateValueAt(this.dataValue, index)

    return changed
  }
}
