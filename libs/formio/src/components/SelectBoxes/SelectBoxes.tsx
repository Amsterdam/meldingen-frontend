import { Components } from '@formio/react'

const FormioSelectBoxes = (Components as any).components.selectboxes

export class SelectBoxes extends FormioSelectBoxes {
  get inputInfo() {
    const inputInfo = super.inputInfo

    inputInfo.attr.class = 'ams-checkbox'
    inputInfo.attr.dir = 'auto'

    return inputInfo
  }

  static editForm() {
    return {
      components: [
        {
          type: 'tabs',
          keys: 'tabs',
          weight: 0,
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
                  label: 'Label SelectBoxes',
                  placeholder: 'Field Label',
                  tooltip: 'The label for this field that will appear next to it.',
                  validate: {
                    required: true,
                  },
                  autofocus: true,
                },
              ],
            },
            {
              label: 'Data',
              key: 'data',
              components: [
                {
                  key: 'multiple',
                  ignore: true,
                },
                {
                  type: 'datagrid',
                  input: true,
                  label: 'Values',
                  key: 'values',
                  tooltip:
                    'The radio button values that can be picked for this field. Values are text submitted with the form data. Labels are text that appears next to the radio buttons on the form.',
                  weight: 10,
                  reorder: true,
                  defaultValue: [{ label: '', value: '' }],
                  components: [
                    {
                      label: 'Label',
                      key: 'label',
                      input: true,
                      type: 'textfield',
                    },
                    {
                      label: 'Value',
                      key: 'value',
                      input: true,
                      type: 'textfield',
                      allowCalculateOverride: true,
                      calculateValue: 'value = _.camelCase(row.label);',
                      validate: {
                        required: true,
                      },
                    },
                  ],
                  conditional: {
                    json: { '===': [{ var: 'data.dataSrc' }, 'values'] },
                  },
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
