// Sourced from:
// - https://github.com/formio/formio.js/blob/master/src/components/_classes/component/editForm
// - https://github.com/formio/formio.js/tree/master/src/components/textfield/editForm

export const editForm = () => ({
  components: [
    {
      type: 'tabs',
      keys: 'tabs',
      components: [
        {
          key: 'display',
          label: 'Display',
          components: [
            {
              weight: 0,
              type: 'textfield',
              input: true,
              key: 'label',
              label: 'Label',
              placeholder: 'Field Label',
              tooltip: 'The label for this field that will appear next to it.',
              validate: {
                required: true,
              },
              autofocus: true,
            },
            {
              weight: 200,
              type: 'textarea',
              input: true,
              key: 'description',
              label: 'Description',
              placeholder: 'Description for this field.',
              tooltip: 'The description is text that will appear below the input field.',
              editor: 'ace',
              as: 'html',
              wysiwyg: {
                minLines: 3,
                isUseWorkerDisabled: true,
              },
            },
          ],
        },
        {
          key: 'validation',
          label: 'Validation',
          components: [
            {
              weight: 10,
              type: 'checkbox',
              label: 'Required',
              tooltip: 'A required field must be filled in before the form can be submitted.',
              key: 'validate.required',
              input: true,
            },
            {
              type: 'panel',
              title: 'JSONLogic Validation',
              key: 'json-validation-json',
              weight: 400,
              components: [
                {
                  type: 'htmlelement',
                  tag: 'div',
                  content: `
                    <p>Validation examples:</p>
                    <ul>
                      <li>Should be 3 characters or more: <code>{">=": [{ "var": "value.length" }, 3]}</code></li>
                      <li>Should be a 100 characters or less: <code>{"<=": [{ "var": "value.length" }, 100]}</code></li>
                    </ul>
                  `,
                },
                {
                  type: 'textarea',
                  key: 'validate.json',
                  hideLabel: true,
                  rows: 5,
                  editor: 'ace',
                  as: 'json',
                  input: true,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
})
