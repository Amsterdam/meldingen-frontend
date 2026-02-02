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
              calculateValue: (context: any) => {
                // An empty string is only used on initial load for number inputs,
                // so we use that here to load the value from the JSON validation only once on load.
                if (context.data?.validate?.maxLength === '') {
                  return context.data?.validate?.json?.if?.[0]?.['<=']?.[1] ?? ''
                }

                return context.data?.validate?.maxLength ?? ''
              },
              input: true,
              key: 'validate.maxLength',
              label: 'Max Length',
              type: 'number',
              weight: 12,
            },
            {
              calculateValue: (context: any) => {
                if (context.data?.validate?.maxLengthErrorMessage === undefined) {
                  return context.data?.validate?.json?.if?.[2] ?? ''
                }

                return context.data?.validate?.maxLengthErrorMessage ?? ''
              },
              input: true,
              key: 'validate.maxLengthErrorMessage',
              label: 'Max Length Error Message',
              type: 'textfield',
              weight: 13,
            },
            {
              as: 'json',
              calculateValue: (context: any) => {
                const maxLength = context.data?.validate?.maxLength
                const maxLengthMessage = context.data?.validate?.maxLengthErrorMessage

                if (maxLength) {
                  return {
                    if: [{ '<=': [{ length: [{ var: 'text' }] }, maxLength] }, true, maxLengthMessage || ''],
                  }
                }

                return ''
              },
              editor: 'ace',
              // hidden: true,
              input: true,
              key: 'validate.json',
              rows: 5,
              type: 'textarea',
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
