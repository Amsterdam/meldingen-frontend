import { filterFormResponse } from './filterFormResponse'
import {
  rootObjMockBefore,
  rootObjMockAfter,
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
  it('should filter the root object', () => {
    expect(filterFormResponse(rootObjMockBefore)).toEqual(rootObjMockAfter)
  })

  it('should filter the panel components', () => {
    const before = { ...rootObjMockBefore, components: panelsMockBefore }
    const after = { ...rootObjMockAfter, components: panelsMockAfter }

    expect(filterFormResponse(before)).toEqual(after)
  })

  it('should filter the radio components', () => {
    const before = { ...rootObjMockBefore, components: { ...panelsMockBefore, components: radiosMockBefore } }
    const after = { ...rootObjMockAfter, components: { ...panelsMockAfter, components: radiosMockAfter } }

    expect(filterFormResponse(before)).toEqual(after)
  })

  it('should filter the select components', () => {
    const before = { ...rootObjMockBefore, components: { ...panelsMockBefore, components: selectsMockBefore } }
    const after = { ...rootObjMockAfter, components: { ...panelsMockAfter, components: selectsMockAfter } }

    expect(filterFormResponse(before)).toEqual(after)
  })

  it('should filter the text area components', () => {
    const before = { ...rootObjMockBefore, components: { ...panelsMockBefore, components: textAreasMockBefore } }
    const after = { ...rootObjMockAfter, components: { ...panelsMockAfter, components: textAreasMockAfter } }

    expect(filterFormResponse(before)).toEqual(after)
  })

  it('should filter the text field components', () => {
    const before = { ...rootObjMockBefore, components: { ...panelsMockBefore, components: textFieldMockBefore } }
    const after = { ...rootObjMockAfter, components: { ...panelsMockAfter, components: textFieldMockAfter } }

    expect(filterFormResponse(before)).toEqual(after)
  })
})
