// Sourced from:
// - https://github.com/formio/formio.js/tree/main/src/components/_classes/component/editForm
// - https://github.com/formio/formio.js/tree/main/src/components/textfield/editForm

import { getContextComponents } from '@formio/js/utils'

import { Context } from '../types'
import {
  getJsonLogicValue,
  getMaxLengthErrorMessageValue,
  getMaxLengthValue,
  getMinLengthErrorMessageValue,
  getMinLengthValue,
} from '../utils'

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
        {
          components: [
            {
              data: {
                values: [
                  { label: 'True', value: 'true' },
                  { label: 'False', value: 'false' },
                ],
              },
              dataSrc: 'values',
              input: true,
              key: 'conditional.show',
              label: 'This component should Display:',
              type: 'select',
              widget: 'html5',
            },
            {
              data: {
                custom: (context: unknown) => getContextComponents(context, false),
              },
              dataSrc: 'custom',
              input: true,
              key: 'conditional.when',
              label: 'When the form component:',
              type: 'select',
              valueProperty: 'value',
            },
            {
              input: true,
              key: 'conditional.eq',
              label: 'Has the value:',
              type: 'textfield',
            },
          ],
          key: 'conditional',
          label: 'Conditional',
        },
      ],
      key: 'tabs',
      type: 'tabs',
    },
  ],
})
