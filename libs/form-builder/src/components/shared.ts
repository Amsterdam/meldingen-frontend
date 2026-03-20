import { getContextComponents } from '@formio/js/utils'

import { Context } from './types'

export const convertEmptyStringToNull = (context: Context) => {
  if (!context.data?.conditional?.show) {
    context.data!.conditional!.show = null
  }
  return true
}

export const conditionalTab = {
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
      // The back end expects a null value when conditional.show is not set, but the form builder sometimes sets it to an empty string.
      // Validate runs last on save, so we need to set it to null here.
      validate: { custom: convertEmptyStringToNull },
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
}
