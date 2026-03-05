import { getContextComponents } from '@formio/js/utils'

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
