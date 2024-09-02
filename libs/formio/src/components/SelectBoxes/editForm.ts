// Sourced from:
// - https://github.com/formio/formio.js/blob/master/src/components/_classes/component/editForm
// - https://github.com/formio/formio.js/blob/master/src/components/selectboxes/editForm

export const editForm = () => ({
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
            {
              weight: 200,
              type: 'textarea',
              input: true,
              key: 'description',
              label: 'Description',
              placeholder: 'Description for this field.',
              tooltip: 'The description is text that will appear below the input field.',
              editor: 'ace',
              as: 'html',
              wysiwyg: {
                minLines: 3,
                isUseWorkerDisabled: true,
              },
            },
          ],
        },
        {
          key: 'data',
          label: 'Data',
          components: [
            {
              type: 'datagrid',
              input: true,
              label: 'Values',
              key: 'values',
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
})
