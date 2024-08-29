import { Components } from '@formio/react'

import { TextAreaEditForm } from './editForm'

const FormioTextarea = (Components as any).components.textarea

export class Textarea extends FormioTextarea {
  get inputInfo() {
    const inputInfo = super.inputInfo

    inputInfo.attr.class = 'ams-text-area'
    inputInfo.attr.dir = 'auto'

    return inputInfo
  }

  static editForm = TextAreaEditForm
}
