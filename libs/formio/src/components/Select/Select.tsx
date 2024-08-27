import { Components } from '@formio/react'

const FormioSelect = (Components as any).components.select

export class Select extends FormioSelect {
  get inputInfo() {
    const inputInfo = super.inputInfo

    inputInfo.attr.class = 'ams-select'
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
                  label: 'Label',
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
                  type: 'datagrid',
                  input: true,
                  label: 'Opties',
                  key: 'data.values',
                  weight: 10,
                  reorder: true,
                  defaultValue: [{ label: '', value: '' }],
                  validate: {
                    required: true,
                  },
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
