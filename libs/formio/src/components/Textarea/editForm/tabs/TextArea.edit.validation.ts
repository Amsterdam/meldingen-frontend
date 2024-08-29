export const TextAreaEditValidation = [
  {
    type: 'panel',
    title: 'JSONLogic Validation',
    key: 'json-validation-json',
    weight: 400,
    components: [
      {
        type: 'htmlelement',
        tag: 'div',
        content: '<h6>MinLength:</h6><pre>{"<": [{"var": "value"}, minLength]}</pre>',
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
]
