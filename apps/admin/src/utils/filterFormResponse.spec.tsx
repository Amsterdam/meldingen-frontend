import { filterFormResponse } from './filterFormResponse'
import {
  rootObjMock,
  panelsMockBefore,
  panelsMockAfter,
  textAreasMockBefore,
  textAreasMockAfter,
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

  it('should filter the text area components', () => {
    const before = { ...rootObjMock, components: { ...panelsMockBefore, components: textAreasMockBefore } }
    const after = { ...rootObjMock, components: { ...panelsMockAfter, components: textAreasMockAfter } }

    expect(filterFormResponse(before)).toEqual(after)
  })
})
