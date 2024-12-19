/* eslint react/no-is-mounted: off */

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
    if (this.component?.maxCharCount && this.refs.charcount) {
      this.setCounter(this.refs.charcount[index], value.length, this.component.maxCharCount)
    }
  }

  updateValue(value: string, _: unknown, index: number) {
    const changed = super.updateValue(value)
    this.triggerUpdateValueAt(this.dataValue, index)

    return changed
  }
}
