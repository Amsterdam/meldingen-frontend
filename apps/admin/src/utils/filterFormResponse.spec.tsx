import { filterFormResponse } from './filterFormResponse'
import {
  rootObjMock,
  panelsMockBefore,
  panelsMockAfter,
  radiosMockBefore,
  radiosMockAfter,
  selectsMockBefore,
  selectsMockAfter,
  textAreasMockBefore,
  textAreasMockAfter,
  textFieldMockBefore,
  textFieldMockAfter,
} from './filterFormResponseMocks'

describe('filterFormResponse', () => {
  it('should not filter the root object', () => {
    expect(filterFormResponse(rootObjMock)).toEqual(rootObjMock)
  })

  it('should filter the panel components', () => {
    const before = { ...rootObjMock, components: panelsMockBefore }
    const after = { ...rootObjMock, components: panelsMockAfter }

    expect(filterFormResponse(before)).toEqual(after)
  })

  it('should filter the radio components', () => {
    const before = { ...rootObjMock, components: { ...panelsMockBefore, components: radiosMockBefore } }
    const after = { ...rootObjMock, components: { ...panelsMockAfter, components: radiosMockAfter } }

    expect(filterFormResponse(before)).toEqual(after)
  })

  it('should filter the select components', () => {
    const before = { ...rootObjMock, components: { ...panelsMockBefore, components: selectsMockBefore } }
    const after = { ...rootObjMock, components: { ...panelsMockAfter, components: selectsMockAfter } }

    expect(filterFormResponse(before)).toEqual(after)
  })

  it('should filter the text area components', () => {
    const before = { ...rootObjMock, components: { ...panelsMockBefore, components: textAreasMockBefore } }
    const after = { ...rootObjMock, components: { ...panelsMockAfter, components: textAreasMockAfter } }

    expect(filterFormResponse(before)).toEqual(after)
  })

  it('should filter the text field components', () => {
    const before = { ...rootObjMock, components: { ...panelsMockBefore, components: textFieldMockBefore } }
    const after = { ...rootObjMock, components: { ...panelsMockAfter, components: textFieldMockAfter } }

    expect(filterFormResponse(before)).toEqual(after)
  })
})
