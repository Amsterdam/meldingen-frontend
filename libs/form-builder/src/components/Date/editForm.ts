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
              defaultValue: 7,
              input: true,
              key: 'dayRange',
              label: 'Day range',
              type: 'number',
              validate: {
                required: true,
              },
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
              wieght: 10,
            },
            {
              input: true,
              key: 'validate.required_error_message',
              label: 'Required error message',
              type: 'textfield',
              weight: 11,
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
