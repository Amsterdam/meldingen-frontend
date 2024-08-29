import { Components } from '@formio/react'

import { SelectBoxesEditData, SelectBoxesEditDisplay, SelectBoxesEditValidation } from './tabs'

export const SelectBoxesEditForm = () => {
  console.log('editForm', Components.baseEditForm())

  return {
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
  }
}
