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

export const selectBoxesMockBefore = [
  {
    label: 'Select Boxes 1',
    description: '',
    key: 'selectBoxes',
    type: 'selectboxes',
    input: true,
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
    id: 'etw3qhu',
    placeholder: '',
    prefix: '',
    customClass: '',
    suffix: '',
    multiple: false,
    defaultValue: null,
    protected: false,
    unique: false,
    persistent: true,
    hidden: false,
    clearOnHide: true,
    refreshOn: '',
    redrawOn: '',
    tableView: false,
    modalEdit: false,
    dataGridLabel: false,
    labelPosition: 'top',
    errorLabel: '',
    tooltip: '',
    hideLabel: false,
    tabindex: '',
    authenticate: false,
    ignoreCache: false,
    template: '<span>{{ item.label }}</span>',
    inputType: 'checkbox',
    data: {
      url: '',
    },
    fieldSet: false,
    inline: false,
  },
  {
    label: 'Select Boxes 2',
    description: '',
    key: 'selectBoxes2',
    type: 'selectboxes',
    input: true,
    position: 5,
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
    question: 75,
    id: 'epnpbkc',
    placeholder: '',
    prefix: '',
    customClass: '',
    suffix: '',
    multiple: false,
    defaultValue: null,
    protected: false,
    unique: false,
    persistent: true,
    hidden: false,
    clearOnHide: true,
    refreshOn: '',
    redrawOn: '',
    tableView: false,
    modalEdit: false,
    dataGridLabel: false,
    labelPosition: 'top',
    errorLabel: '',
    tooltip: '',
    hideLabel: false,
    tabindex: '',
    disabled: false,
    autofocus: false,
    dbIndex: false,
    customDefaultValue: '',
    calculateValue: '',
    calculateServer: false,
    widget: null,
    attributes: {},
    validateOn: 'change',
    validate: {
      required: false,
      custom: '',
      customPrivate: false,
      strictDateValidation: false,
      multiple: false,
      unique: false,
      onlyAvailableItems: false,
    },
  },
]

export const selectBoxesMockAfter = [
  {
    label: 'Select Boxes 1',
    description: '',
    key: 'selectBoxes',
    type: 'selectboxes',
    input: true,
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
  },
  {
    label: 'Select Boxes 2',
    description: '',
    key: 'selectBoxes2',
    type: 'selectboxes',
    input: true,
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
    maxCharCount: 80,
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
    maxCharCount: 80,
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
    maxCharCount: 80,
  },
  {
    label: 'Text Area 2',
    description: '',
    key: 'textArea2',
    type: 'textarea',
    input: true,
    autoExpand: false,
    maxCharCount: 80,
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
