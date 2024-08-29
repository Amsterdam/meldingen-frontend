import { SelectBoxesEditData, SelectBoxesEditDisplay, SelectBoxesEditValidation } from './tabs'

export const SelectBoxesEditForm = () => ({
  components: [
    {
      type: 'tabs',
      keys: 'tabs',
      weight: 0,
      components: [
        {
          key: 'display',
          label: 'Display',
          components: SelectBoxesEditDisplay,
        },
        {
          key: 'data',
          label: 'Data',
          components: SelectBoxesEditData,
        },
        {
          key: 'validation',
          label: 'Validation',
          components: SelectBoxesEditValidation,
        },
      ],
    },
  ],
})
