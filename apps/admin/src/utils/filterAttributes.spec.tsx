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
}

const filteredObjMock = {
  label: 'Label',
  description: 'Description',
  autoExpand: false,
  showCharCount: true,
  key: 'key',
  type: 'textarea',
  input: true,
}

describe('filterAttributes', () => {
  it('should filter disallowed attributes from an object', () => {
    expect(filterAttributes(unfilteredObjMock)).toEqual(filteredObjMock)
  })
})
