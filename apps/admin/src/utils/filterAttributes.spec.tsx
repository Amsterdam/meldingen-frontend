import { filterAttributes } from './filterAttributes'

const unfilteredObjMock = {
  label: 'Label',
  description: 'Description',
  applyMaskOn: 'change',
  autoExpand: false,
  showCharCount: true,
  tableView: true,
  validate: {
    required: true,
  },
  errors: {
    required: 'Dit is een verplicht veld',
  },
  key: 'key',
  type: 'textarea',
  input: true,
  components: [
    {
      label: 'Label',
      description: 'Description',
      applyMaskOn: 'change',
      autoExpand: false,
      showCharCount: true,
      tableView: true,
    },
  ],
}

const filteredObjMock = {
  label: 'Label',
  key: 'key',
  type: 'textarea',
  input: true,
  components: [
    {
      label: 'Label',
      description: 'Description',
      autoExpand: false,
      showCharCount: true,
    },
  ],
}

describe('filterAttributes', () => {
  it('should filter disallowed attributes from an object', () => {
    expect(filterAttributes(unfilteredObjMock)).toEqual(filteredObjMock)
  })
})
