import { renderHook } from '@testing-library/react'
import Cookies from 'js-cookie'

import { useWFSLayer } from './useWFSLayer'

vi.mock('js-cookie', () => ({
  default: {
    get: vi.fn(),
  },
}))

describe('renderWFSLayer', () => {
  let mockMap: any
  let onMock: any
  let getZoomMock: any
  let getBoundsMock: any

  beforeEach(() => {
    onMock = vi.fn()
    getZoomMock = vi.fn(() => 17)
    getBoundsMock = vi.fn(() => ({
      getSouthWest: () => ({ lat: 52.1, lng: 4.9 }),
      getNorthEast: () => ({ lat: 52.2, lng: 5.0 }),
    }))

    mockMap = {
      on: onMock,
      getZoom: getZoomMock,
      getBounds: getBoundsMock,
    }
    ;(Cookies.get as any).mockReturnValue('container')
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should return early when classification is missing', () => {
    ;(Cookies.get as any).mockReturnValue(undefined)

    renderHook(() => useWFSLayer(mockMap))

    expect(mockMap.on).not.toBeCalled()
  })

  it('should return undefined when classification does not have assets', () => {
    ;(Cookies.get as any).mockReturnValue('no-asset-classification')

    renderHook(() => useWFSLayer(mockMap))

    expect(mockMap.on).not.toBeCalled()
  })
})
