// Sourced from:
// - https://github.com/formio/formio.js/blob/master/src/components/_classes/component/editForm
// - https://github.com/formio/formio.js/blob/master/src/components/textarea/editForm
// - https://github.com/formio/formio.js/blob/master/src/components/textfield/editForm/TextField.edit.display.js

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
            {
              input: true,
              key: 'maxCharCount',
              label: 'Max character count',
              tooltip:
                'Show a live count of the number of characters with a maximum amount of characters. Leave empty when the character counter should not be shown.',
              type: 'textfield',
              validate: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                custom: (context: any) => {
                  if (!context.data.maxCharCount) {
                    context.data.maxCharCount = null
                  }
                  return true
                },
              },
              weight: 1202,
            },
            {
              conditional: {
                json: {
                  '==': [{ var: 'data.editor' }, ''],
                },
              },
              input: true,
              key: 'autoExpand',
              label: 'Auto Expand',
              tooltip: "This will make the TextArea auto expand it's height as the user is typing into the area.",
              type: 'checkbox',
              weight: 415,
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
          ],
          key: 'validation',
          label: 'Validation',
        },
      ],
      key: 'tabs',
      type: 'tabs',
      weight: 0,
    },
  ],
})
