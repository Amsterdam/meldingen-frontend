import type { Mock } from 'vitest'

import { render } from '@testing-library/react'
import { Map } from 'leaflet'
import { useRef } from 'react'

import { MapComponent } from './Map'

vi.mock('leaflet', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...(typeof actual === 'object' ? actual : {}),
  }
})

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...(typeof actual === 'object' ? actual : {}),
    useRef: vi.fn().mockReturnValue({ current: 'test' }),
  }
})

describe('MapComponent', () => {
  it('renders the component', () => {
    const { container } = render(<MapComponent />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('sets up a Leaflet map instance when it does not exist already and container exists', () => {
    const containerRef = { current: 'not-null' }
    const createdMapInstanceRef = { current: false }
    ;(useRef as Mock).mockReturnValueOnce(containerRef).mockReturnValue(createdMapInstanceRef)

    const { container } = render(<MapComponent />)

    const leafletContainer = container.querySelector('[class*="leaflet-container"]')
    expect(leafletContainer).toBeInTheDocument()
  })

  it('makes the map inert when isInert is true', () => {
    const { container } = render(<MapComponent isInert />)

    const element = container.querySelector('[inert]')

    expect(element).toBeInTheDocument()
  })

  it('calls remove when the component unmounts', () => {
    const containerRef = { current: 'not-null' }
    const createdMapInstanceRef = { current: false }
    ;(useRef as Mock).mockReturnValueOnce(containerRef).mockReturnValue(createdMapInstanceRef)

    const removeSpy = vi.spyOn(Map.prototype, 'remove')

    const { unmount } = render(<MapComponent />)
    unmount()

    expect(removeSpy).toHaveBeenCalled()

    removeSpy.mockRestore()
  })
})
