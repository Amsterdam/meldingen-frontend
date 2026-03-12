export const editForm = () => ({
  components: [
    {
      components: [
        {
          components: [
            {
              autofocus: true,
              input: true,
              key: 'title',
              label: 'Title',
              placeholder: 'Panel Title',
              type: 'textfield',
              validate: {
                required: true,
              },
            },
          ],
          key: 'display',
          label: 'Display',
        },
      ],
      key: 'tabs',
      type: 'tabs',
    },
  ],
})
