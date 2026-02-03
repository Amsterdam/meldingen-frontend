// Sourced from:
// - https://github.com/formio/formio.js/tree/main/src/components/_classes/component/editForm
// - https://github.com/formio/formio.js/tree/main/src/components/textfield/editForm

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
              input: true,
              key: 'validate.required',
              label: 'Required',
              tooltip: 'A required field must be filled in before the form can be submitted.',
              type: 'checkbox',
            },
            {
              input: true,
              key: 'validate.required_error_message',
              label: 'Required error message',
              type: 'textfield',
            },
            {
              calculateValue: (context: any) => {
                const validateObj = context.data?.validate

                // Form.io uses this 'pristine' value to determine if this input has been modified since load.
                if (context.self.pristine) {
                  return validateObj?.json?.if?.[0]?.['<=']?.[1] ?? ''
                }

                return validateObj?.maxLength ?? ''
              },
              input: true,
              key: 'validate.maxLength',
              label: 'Max Length',
              type: 'number',
            },
            {
              calculateValue: (context: any) => {
                const validateObj = context.data?.validate

                // Form.io uses this 'pristine' value to determine if this input has been modified since load.
                if (context.self.pristine) {
                  return validateObj?.json?.if?.[2] ?? ''
                }

                return validateObj?.maxLengthErrorMessage ?? ''
              },
              input: true,
              key: 'validate.maxLengthErrorMessage',
              label: 'Max Length Error Message',
              type: 'textfield',
            },
            {
              calculateValue: (context: any) => {
                const validateObj = context.data?.validate

                // Form.io uses this 'pristine' value to determine if this input has been modified since load.
                if (context.self.pristine) {
                  return validateObj?.json?.if?.[1]?.if?.[0]?.['>=']?.[1] ?? ''
                }

                return validateObj?.minLength ?? ''
              },
              input: true,
              key: 'validate.minLength',
              label: 'Min Length',
              type: 'number',
            },
            {
              calculateValue: (context: any) => {
                const validateObj = context.data?.validate

                // Form.io uses this 'pristine' value to determine if this input has been modified since load.
                if (context.self.pristine) {
                  return validateObj?.json?.if?.[1]?.if?.[2] ?? ''
                }

                return validateObj?.minLengthErrorMessage ?? ''
              },
              input: true,
              key: 'validate.minLengthErrorMessage',
              label: 'Min Length Error Message',
              type: 'textfield',
            },
            {
              as: 'json',
              calculateValue: (context: any) => {
                const validateObj = context.data?.validate

                const maxLength = validateObj?.maxLength as number | ''
                const maxLengthMessage = validateObj?.maxLengthErrorMessage as string | undefined
                const minLength = validateObj?.minLength as number | ''
                const minLengthMessage = validateObj?.minLengthErrorMessage as string | undefined

                const minLengthRule =
                  minLength !== ''
                    ? {
                        if: [{ '>=': [{ length: [{ var: 'text' }] }, minLength] }, true, minLengthMessage || ''],
                      }
                    : null

                const getMaxLengthRule = (nestedRule: { if: unknown[] } | null) =>
                  maxLength !== ''
                    ? {
                        if: [
                          { '<=': [{ length: [{ var: 'text' }] }, maxLength] },
                          nestedRule ?? true,
                          maxLengthMessage || '',
                        ],
                      }
                    : null

                switch (true) {
                  case minLength !== '' && maxLength !== '':
                    return getMaxLengthRule(minLengthRule)
                  case minLength !== '':
                    return minLengthRule
                  case maxLength !== '':
                    return getMaxLengthRule(null)
                  default:
                    return ''
                }
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
