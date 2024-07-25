export const rootObjMock = {
  title: 'Test title',
  display: 'wizard',
  id: 2,
  classification: null,
  components: [],
}

export const panelsMockBefore = [
  {
    label: 'Page 1',
    key: 'page1',
    type: 'panel',
    input: false,
    components: [],
    position: 1,
    placeholder: '',
    prefix: '',
    showCharCount: false,
  },
  {
    label: 'Page 2',
    key: 'page2',
    type: 'panel',
    input: false,
    components: [],
    position: 2,
    placeholder: '',
    prefix: '',
    showCharCount: false,
  },
]

export const panelsMockAfter = [
  {
    label: 'Page 1',
    key: 'page1',
    type: 'panel',
    input: false,
    components: [],
  },
  {
    label: 'Page 2',
    key: 'page2',
    type: 'panel',
    input: false,
    components: [],
  },
]

export const radiosMockBefore = [
  {
    label: 'Radio 1',
    labelPosition: 'top',
    optionsLabelPosition: 'right',
    description: '',
    tooltip: '',
    customClass: '',
    tabindex: '',
    inline: false,
    input: true,
    hidden: false,
    hideLabel: false,
    autofocus: false,
    values: [
      {
        label: 'Een',
        value: 'een',
        shortcut: '',
      },
      {
        label: 'Twee',
        value: 'twee',
        shortcut: '',
      },
    ],
    key: 'radio1',
    type: 'radio',
    inputType: 'radio',
  },
  {
    label: 'Radio 2',
    description: '',
    values: [
      {
        label: 'Een',
        value: 'een',
        shortcut: '',
      },
      {
        label: 'Twee',
        value: 'twee',
        shortcut: '',
      },
    ],
    dataType: '',
    valueProperty: '',
    allowCalculateOverride: false,
    validate: {
      required: false,
      onlyAvailableItems: false,
      customMessage: '',
      custom: '',
      customPrivate: false,
      json: '',
      strictDateValidation: false,
      multiple: false,
      unique: false,
    },
    key: 'radio2',
    type: 'radio',
    inputType: 'radio',
    input: true,
  },
]

export const radiosMockAfter = [
  {
    label: 'Radio 1',
    description: '',
    values: [
      {
        label: 'Een',
        value: 'een',
        shortcut: '',
      },
      {
        label: 'Twee',
        value: 'twee',
        shortcut: '',
      },
    ],
    key: 'radio1',
    type: 'radio',
    input: true,
  },
  {
    label: 'Radio 2',
    description: '',
    values: [
      {
        label: 'Een',
        value: 'een',
        shortcut: '',
      },
      {
        label: 'Twee',
        value: 'twee',
        shortcut: '',
      },
    ],
    key: 'radio2',
    type: 'radio',
    input: true,
  },
]

export const selectsMockBefore = [
  {
    label: 'Select 1',
    labelPosition: 'top',
    widget: 'html5',
    placeholder: '',
    description: '',
    tooltip: '',
    customClass: '',
    tabindex: '',
    hidden: false,
    data: {
      values: [
        {
          label: 'Een',
          value: 'een',
        },
        {
          label: 'Twee',
          value: 'twee',
        },
      ],
      resource: '',
      url: '',
      json: '',
      custom: '',
    },
    key: 'select1',
    type: 'select',
    input: true,
  },
  {
    label: 'Select 2',
    widget: 'html5',
    placeholder: '',
    description: '',
    data: {
      values: [
        {
          label: 'Een',
          value: 'een',
        },
        {
          label: 'Twee',
          value: 'twee',
        },
      ],
      resource: '',
      url: '',
      json: '',
      custom: '',
    },
    validate: {
      required: false,
      onlyAvailableItems: false,
      customMessage: '',
      custom: '',
      customPrivate: false,
      json: '',
      strictDateValidation: false,
      multiple: false,
      unique: false,
    },
    unique: false,
    key: 'select2',
    indexeddb: {
      filter: {},
    },
    type: 'select',
    input: true,
  },
]

export const selectsMockAfter = [
  {
    label: 'Select 1',
    widget: 'html5',
    placeholder: '',
    description: '',
    key: 'select1',
    type: 'select',
    input: true,
    data: {
      values: [
        {
          label: 'Een',
          value: 'een',
        },
        {
          label: 'Twee',
          value: 'twee',
        },
      ],
      resource: '',
      url: '',
      json: '',
      custom: '',
    },
  },
  {
    label: 'Select 2',
    widget: 'html5',
    placeholder: '',
    description: '',
    key: 'select2',
    type: 'select',
    input: true,
    data: {
      values: [
        {
          label: 'Een',
          value: 'een',
        },
        {
          label: 'Twee',
          value: 'twee',
        },
      ],
      resource: '',
      url: '',
      json: '',
      custom: '',
    },
  },
]

export const textAreasMockBefore = [
  {
    label: 'Text Area 1',
    description: '',
    key: 'textArea1',
    type: 'textarea',
    input: true,
    autoExpand: false,
    showCharCount: false,
    position: 1,
    question: null,
    placeholder: '',
    prefix: '',
    customClass: '',
    suffix: '',
  },
  {
    label: 'Text Area 2',
    description: '',
    key: 'textArea2',
    type: 'textarea',
    input: true,
    autoExpand: false,
    showCharCount: false,
    position: 2,
    question: null,
    placeholder: '',
    prefix: '',
    customClass: '',
    suffix: '',
  },
]

export const textAreasMockAfter = [
  {
    label: 'Text Area 1',
    description: '',
    key: 'textArea1',
    type: 'textarea',
    input: true,
    autoExpand: false,
    showCharCount: false,
  },
  {
    label: 'Text Area 2',
    description: '',
    key: 'textArea2',
    type: 'textarea',
    input: true,
    autoExpand: false,
    showCharCount: false,
  },
]

export const textFieldMockBefore = [
  {
    label: 'Text Field 1',
    labelPosition: 'top',
    placeholder: '',
    description: '',
    tooltip: '',
    prefix: '',
    suffix: '',
    widget: {
      type: 'input',
    },
    validate: {
      required: false,
      pattern: '',
      customMessage: '',
      custom: '',
      customPrivate: false,
      json: '',
      minLength: '',
      maxLength: '',
      strictDateValidation: false,
      multiple: false,
      unique: false,
    },
    key: 'textField1',
    type: 'textfield',
    input: true,
  },
  {
    label: 'Text Field 2',
    description: '',
    key: 'textField2',
    type: 'textfield',
    tags: [],
    properties: {},
    conditional: {
      show: null,
      when: null,
      eq: '',
      json: '',
    },
    customConditional: '',
    logic: [],
    attributes: {},
    overlay: {
      style: '',
      page: '',
      left: '',
      top: '',
      width: '',
      height: '',
    },
    input: true,
  },
]

export const textFieldMockAfter = [
  {
    label: 'Text Field 1',
    description: '',
    key: 'textField1',
    type: 'textfield',
    input: true,
  },
  {
    label: 'Text Field 2',
    description: '',
    key: 'textField2',
    type: 'textfield',
    input: true,
  },
]
