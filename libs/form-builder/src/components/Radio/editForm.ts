// Sourced from:
// - https://github.com/formio/formio.js/blob/master/src/components/_classes/component/editForm
// - https://github.com/formio/formio.js/blob/master/src/components/radio/editForm

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
              tooltip:
                'The radio button values that can be picked for this field. Values are text submitted with the form data. Labels are text that appears next to the radio buttons on the form.',
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
              weight: 10,
              type: 'checkbox',
              label: 'Required',
              tooltip: 'A required field must be filled in before the form can be submitted.',
              key: 'validate.required',
              input: true,
            },
            {
              weight: 11,
              type: 'textfield',
              label: 'Required error message',
              key: 'validate.required_error_message',
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
