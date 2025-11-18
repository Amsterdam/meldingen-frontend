// Sourced from:
// - https://github.com/formio/formio.js/blob/master/src/components/_classes/component/editForm
// - https://github.com/formio/formio.js/blob/master/src/components/radio/editForm

export const editForm = () => ({
  components: [
    {
      components: [
        {
          components: [
            {
              autofocus: true,
              input: true,
              key: 'label',
              label: 'Label',
              placeholder: 'Field Label',
              tooltip: 'The label for this field that will appear next to it.',
              type: 'textfield',
              validate: {
                required: true,
              },
              weight: 0,
            },
            {
              as: 'html',
              editor: 'ace',
              input: true,
              key: 'description',
              label: 'Description',
              placeholder: 'Description for this field.',
              tooltip: 'The description is text that will appear below the input field.',
              type: 'textarea',
              weight: 200,
              wysiwyg: {
                isUseWorkerDisabled: true,
                minLines: 3,
              },
            },
          ],
          key: 'display',
          label: 'Display',
        },
        {
          components: [
            {
              components: [
                {
                  input: true,
                  key: 'label',
                  label: 'Label',
                  type: 'textfield',
                },
                {
                  allowCalculateOverride: true,
                  calculateValue: 'value = _.camelCase(row.label);',
                  input: true,
                  key: 'value',
                  label: 'Value',
                  type: 'textfield',
                  validate: {
                    required: true,
                  },
                },
              ],
              conditional: {
                json: { '===': [{ var: 'data.dataSrc' }, 'values'] },
              },
              defaultValue: [{ label: '', value: '' }],
              input: true,
              key: 'values',
              label: 'Values',
              reorder: true,
              tooltip:
                'The radio button values that can be picked for this field. Values are text submitted with the form data. Labels are text that appears next to the radio buttons on the form.',
              type: 'datagrid',
              validate: {
                required: true,
              },
              weight: 10,
            },
          ],
          key: 'data',
          label: 'Data',
        },
        {
          components: [
            {
              input: true,
              key: 'validate.required',
              label: 'Required',
              tooltip: 'A required field must be filled in before the form can be submitted.',
              type: 'checkbox',
              weight: 10,
            },
            {
              input: true,
              key: 'validate.required_error_message',
              label: 'Required error message',
              type: 'textfield',
              weight: 11,
            },
            {
              components: [
                {
                  as: 'json',
                  editor: 'ace',
                  hideLabel: true,
                  input: true,
                  key: 'validate.json',
                  rows: 5,
                  type: 'textarea',
                },
              ],
              key: 'json-validation-json',
              title: 'JSONLogic Validation',
              type: 'panel',
              weight: 400,
            },
          ],
          key: 'validation',
          label: 'Validation',
        },
      ],
      keys: 'tabs',
      type: 'tabs',
      weight: 0,
    },
  ],
})
