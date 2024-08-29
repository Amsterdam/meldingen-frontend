export const SelectBoxesEditDisplay = [
  {
    weight: 0,
    type: 'textfield',
    input: true,
    key: 'label',
    label: 'Label SelectBoxes',
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
]
