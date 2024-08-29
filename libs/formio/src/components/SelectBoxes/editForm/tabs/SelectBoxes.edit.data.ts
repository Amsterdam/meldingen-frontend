export const SelectBoxesEditData = [
  {
    key: 'multiple',
    ignore: true,
  },
  {
    type: 'datagrid',
    input: true,
    label: 'Values',
    key: 'values',
    weight: 10,
    reorder: true,
    defaultValue: [{ label: '', value: '' }],
    components: [
      {
        label: 'Label',
        key: 'label',
        input: true,
        type: 'textfield',
      },
      {
        label: 'Value',
        key: 'value',
        input: true,
        type: 'textfield',
        allowCalculateOverride: true,
        calculateValue: 'value = _.camelCase(row.label);',
        validate: {
          required: true,
        },
      },
    ],
    conditional: {
      json: { '===': [{ var: 'data.dataSrc' }, 'values'] },
    },
  },
]
