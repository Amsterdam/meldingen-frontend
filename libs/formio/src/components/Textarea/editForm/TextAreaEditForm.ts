import { TextAreaEditDisplay, TextAreaEditValidation } from './tabs'

export const TextAreaEditForm = () => ({
  components: [
    {
      type: 'tabs',
      keys: 'tabs',
      weight: 0,
      components: [
        {
          key: 'display',
          label: 'Display',
          components: TextAreaEditDisplay,
        },
        {
          key: 'validation',
          label: 'Validation',
          components: TextAreaEditValidation,
        },
      ],
    },
  ],
})
