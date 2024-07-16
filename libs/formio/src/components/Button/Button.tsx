import { Components } from '@formio/react'

const FormioButton = (Components as any).components.button

export class Button extends FormioButton {
  get inputInfo() {
    const inputInfo = super.inputInfo
    inputInfo.attr.class = 'ams-button ams-button--primary'
    return inputInfo
  }
}
