// Sourced from:
// - https://github.com/formio/formio.js/blob/master/src/components/_classes/component/editForm
// - https://github.com/formio/formio.js/blob/master/src/components/textarea/editForm
// - https://github.com/formio/formio.js/blob/master/src/components/textfield/editForm/TextField.edit.display.js

const validationExamplesHTML = `
<p>Validatie voorbeelden:</p>
<ul>
<li>Mag maximaal 100 tekens zijn:
<pre><code>{"if": [
  { "<=": [{ "length": [{ "var": "text" }]}, 100]},
  true,
  "De omschrijving van de melding mag maximaal 100 tekens zijn."
]}
</code></pre>
</li>
<li>Moet minimaal 3 tekens zijn:
<pre><code>{"if": [
  { ">=": [{ "length": [{ "var": "text" }]}, 3]},
  true,
  "De omschrijving van de melding moet minimaal 3 tekens zijn."
]}
</code></pre>
</ul>
`

export const editForm = () => ({
  components: [
    {
      type: 'tabs',
      keys: 'tabs',
      weight: 0,
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
            {
              weight: 1202,
              type: 'textfield',
              label: 'Max character count',
              tooltip:
                'Show a live count of the number of characters with a maximum amount of characters. Leave empty when the character counter should not be shown.',
              key: 'maxCharCount',
              input: true,
              validate: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                custom: (context: any) => {
                  if (!context.data.maxCharCount) {
                    context.data.maxCharCount = null
                  }
                  return true
                },
              },
            },
            {
              type: 'checkbox',
              input: true,
              key: 'autoExpand',
              label: 'Auto Expand',
              tooltip: "This will make the TextArea auto expand it's height as the user is typing into the area.",
              weight: 415,
              conditional: {
                json: {
                  '==': [{ var: 'data.editor' }, ''],
                },
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
              weight: 11,
              type: 'textfield',
              label: 'Required error message',
              key: 'validate.required_error_message',
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
                  content: validationExamplesHTML,
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
