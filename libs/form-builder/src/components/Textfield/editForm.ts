// Sourced from:
// - https://github.com/formio/formio.js/blob/master/src/components/_classes/component/editForm
// - https://github.com/formio/formio.js/tree/master/src/components/textfield/editForm

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
              weight: 0,
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
              weight: 200,
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
              weight: 10,
            },
            {
              input: true,
              key: 'validate.required_error_message',
              label: 'Required error message',
              type: 'textfield',
              weight: 11,
            },
            {
              input: true,
              key: 'validate.min_length',
              label: 'Minimun characters',
              type: 'number',
              weight: 12,
            },
            {
              input: true,
              key: 'validate.min_length_error_message',
              label: 'Minimun characters error message',
              type: 'textfield',
              weight: 13,
            },
            {
              components: [
                {
                  content: validationExamplesHTML,
                  tag: 'div',
                  type: 'htmlelement',
                },
                {
                  as: 'json',
                  editor: 'ace',
                  hideLabel: true,
                  input: true,
                  key: 'validate.json',
                  rows: 5,
                  type: 'textarea',
                },
              ],
              key: 'json-validation-json',
              title: 'JSONLogic Validation',
              type: 'panel',
              weight: 400,
            },
          ],
          key: 'validation',
          label: 'Validation',
        },
      ],
      key: 'tabs',
      type: 'tabs',
    },
  ],
})
