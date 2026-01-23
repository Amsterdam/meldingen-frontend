// Sourced from:
// - https://github.com/formio/formio.js/blob/master/src/components/_classes/component/editForm
// - https://github.com/formio/formio.js/tree/master/src/components/textfield/editForm

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
              input: true,
              key: 'validate.min_length',
              label: 'Minimun characters',
              type: 'number',
              weight: 12,
            },
            {
              input: true,
              key: 'validate.min_length_error_message',
              label: 'Minimun characters error message',
              type: 'textfield',
              weight: 13,
            },
            {
              input: true,
              key: 'validate.max_length',
              label: 'Maximum characters',
              type: 'number',
              weight: 14,
            },
            {
              input: true,
              key: 'validate.max_length_error_message',
              label: 'Maximum characters error message',
              type: 'textfield',
              weight: 15,
            },
          ],
          key: 'validation',
          label: 'Validation',
        },
      ],
      key: 'tabs',
      type: 'tabs',
    },
  ],
})
