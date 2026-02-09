// Sourced from:
// - https://github.com/formio/formio.js/blob/main/src/components/_classes/component/editForm
// - https://github.com/formio/formio.js/blob/main/src/components/textarea/editForm
// - https://github.com/formio/formio.js/blob/main/src/components/textfield/editForm/TextField.edit.display.js

import { Context } from '../types'
import {
  getJsonLogicValue,
  getMaxLengthErrorMessageValue,
  getMaxLengthValue,
  getMinLengthErrorMessageValue,
  getMinLengthValue,
} from '../utils'

export const getMaxCharCountValue = (context: Context) => {
  const validateObj = context.data?.validate
  return validateObj?.maxLength ?? ''
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
            {
              calculateValue: getMaxCharCountValue,
              hidden: true, // This field stores the max character count. It is calculated from the validate.maxLength value
              input: true,
              key: 'maxCharCount',
              type: 'textfield',
              validate: {
                custom: (context: { data?: { maxCharCount?: number | null } }) => {
                  if (!context.data?.maxCharCount) {
                    // The back end expects a null value when there is no max char count, but the form builder sets it to an empty string when the value is cleared.
                    // Validate runs last on save, so we need to set it to null here.
                    context.data!.maxCharCount = null
                  }
                  return true
                },
              },
              validateWhenHidden: true,
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
              calculateValue: (context: Context) => getMaxLengthErrorMessageValue(context, getMaxLengthValue(context)),
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
              calculateValue: (context: Context) => getMinLengthErrorMessageValue(context, getMinLengthValue(context)),
              input: true,
              key: 'validate.minLengthErrorMessage',
              label: 'Min Length Error Message',
              type: 'textfield',
            },
            {
              as: 'json',
              calculateValue: getJsonLogicValue,
              editor: 'ace',
              hidden: true, // This field stores the data we send to the backend. It is calculated from the other validation fields, so we hide it from the user.
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
