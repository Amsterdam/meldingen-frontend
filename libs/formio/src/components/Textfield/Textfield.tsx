import { Components } from '@formio/react'

const FormioTextfield = (Components as any).components.textfield

export class Textfield extends FormioTextfield {
  get inputInfo() {
    const inputInfo = super.inputInfo

    inputInfo.attr.class = 'ams-text-input'
    inputInfo.attr.dir = 'auto'

    return inputInfo
  }
}
