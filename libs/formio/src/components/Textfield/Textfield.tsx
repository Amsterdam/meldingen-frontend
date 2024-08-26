import { Components } from '@formio/react'

const FormioTextfield = (Components as any).components.textfield

export class Textfield extends FormioTextfield {
  get inputInfo() {
    const inputInfo = super.inputInfo

    inputInfo.attr.class = 'ams-text-input'
    inputInfo.attr.dir = 'auto'

    return inputInfo
  }

  static editForm() {
    return {
      components: [
        {
          type: 'tabs',
          keys: 'tabs',
          components: [
            {
              key: 'display',
              label: 'Display',
              components: [
                {
                  weight: 0,
                  type: 'textfield',
                  input: true,
                  key: 'label',
                  label: 'Label',

                  validate: {
                    required: true,
                  },
                  autofocus: true,
                },
              ],
            },
            {
              key: 'validation',
              label: 'Validation',
              components: [
                {
                  type: 'panel',
                  title: 'JSONLogic Validation',
                  key: 'json-validation-json',
                  weight: 400,
                  components: [
                    {
                      type: 'htmlelement',
                      tag: 'div',
                      content: '<h6>MinLength:</h6><pre>{"<": [{"var": "value"}, minLength]}</pre>',
                    },
                    {
                      type: 'textarea',
                      key: 'validate.json',
                      hideLabel: true,
                      rows: 5,
                      editor: 'ace',
                      as: 'json',
                      input: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }
  }
}
