/* eslint-disable @typescript-eslint/no-explicit-any */

// Sourced from:
// - https://github.com/formio/formio.js/tree/main/src/components/_classes/component/editForm
// - https://github.com/formio/formio.js/tree/main/src/components/textfield/editForm

const getMaxLengthValue = (context: any) => {
  const validateObj = context.data?.validate
  // Form.io uses this 'pristine' value to determine if this input has been modified since load.
  if (context.self.pristine) {
    return validateObj?.json?.if?.[0]?.['<=']?.[1] ?? ''
  }
  return validateObj?.maxLength ?? ''
}

const getMaxLengthErrorMessageValue = (context: any, maxLengthValue: number | '') => {
  const validateObj = context.data?.validate
  if (context.self.pristine && maxLengthValue !== '') {
    return validateObj?.json?.if?.[2] ?? ''
  }
  return validateObj?.maxLengthErrorMessage ?? ''
}

const getMinLengthValue = (context: any) => {
  const validateObj = context.data?.validate
  if (context.self.pristine) {
    const nestedRule = validateObj?.json?.if?.[1]?.if?.[0]?.['>=']?.[1]
    const nonNestedRule = validateObj?.json?.if?.[0]?.['>=']?.[1]
    return nestedRule ?? nonNestedRule ?? ''
  }
  return validateObj?.minLength ?? ''
}

const getMinLengthErrorMessageValue = (context: any, minLengthValue: number | '') => {
  const validateObj = context.data?.validate
  if (context.self.pristine && minLengthValue !== '') {
    const nestedRule = validateObj?.json?.if?.[1]?.if?.[2]
    const nonNestedRule = validateObj?.json?.if?.[2]
    return nestedRule ?? nonNestedRule ?? ''
  }
  return validateObj?.minLengthErrorMessage ?? ''
}

const getJsonLogicValue = (context: any) => {
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
          if: [{ '<=': [{ length: [{ var: 'text' }] }, maxLength] }, nestedRule ?? true, maxLengthMessage || ''],
        }
      : null

  if (minLength !== '' && maxLength !== '') {
    return getMaxLengthRule(minLengthRule)
  }
  if (minLength !== '') {
    return minLengthRule
  }
  if (maxLength !== '') {
    return getMaxLengthRule(null)
  }
  return ''
}

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
              calculateValue: getMaxLengthValue,
              input: true,
              key: 'validate.maxLength',
              label: 'Max Length',
              type: 'number',
            },
            {
              calculateValue: (context: any) => getMaxLengthErrorMessageValue(context, getMaxLengthValue(context)),
              input: true,
              key: 'validate.maxLengthErrorMessage',
              label: 'Max Length Error Message',
              type: 'textfield',
            },
            {
              calculateValue: getMinLengthValue,
              input: true,
              key: 'validate.minLength',
              label: 'Min Length',
              type: 'number',
            },
            {
              calculateValue: (context: any) => getMinLengthErrorMessageValue(context, getMinLengthValue(context)),
              input: true,
              key: 'validate.minLengthErrorMessage',
              label: 'Min Length Error Message',
              type: 'textfield',
            },
            {
              as: 'json',
              calculateValue: getJsonLogicValue,
              editor: 'ace',
              hidden: true,
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
