'use client'

import { Components } from '@formio/react'

const FormioTextArea = (Components as any).components.textarea

export class Textarea extends FormioTextArea {
  get inputInfo() {
    const inputInfo = super.inputInfo

    inputInfo.attr.class = 'ams-text-area'
    inputInfo.attr.dir = 'auto'

    return inputInfo
  }
}
