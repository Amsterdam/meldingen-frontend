// Sourced from:
// - https://github.com/formio/formio.js/blob/master/src/components/_classes/component/editForm
// - https://github.com/formio/formio.js/blob/master/src/components/select/editForm

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
              type: 'select',
              input: true,
              weight: 20,
              tooltip: "Select the type of widget you'd like to use.",
              key: 'widget',
              defaultValue: 'html5',
              label: 'Widget Type',
              dataSrc: 'values',
              data: {
                values: [{ label: 'HTML 5', value: 'html5' }],
              },
            },
            {
              weight: 100,
              type: 'textfield',
              input: true,
              key: 'placeholder',
              label: 'Placeholder',
              placeholder: 'Placeholder',
              tooltip: 'The placeholder text that will appear when this field is empty.',
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
          label: 'Data',
          key: 'data',
          components: [
            {
              type: 'datagrid',
              input: true,
              label: 'Data Source Values',
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
              weight: 10,
              type: 'checkbox',
              label: 'Required',
              tooltip: 'A required field must be filled in before the form can be submitted.',
              key: 'validate.required',
              input: true,
            },
            {
              type: 'panel',
              title: 'JSONLogic Validation',
              key: 'json-validation-json',
              weight: 400,
              components: [
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
