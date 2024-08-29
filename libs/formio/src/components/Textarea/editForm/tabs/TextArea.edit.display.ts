export const TextAreaEditDisplay = [
  {
    weight: 0,
    type: 'textfield',
    input: true,
    key: 'label',
    label: 'Label TextArea',
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
    weight: 1201,
    type: 'checkbox',
    label: 'Show Character Counter',
    tooltip: 'Show a live count of the number of characters.',
    key: 'showCharCount',
    input: true,
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
]
