import type { RefObject } from 'react'
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

  it('applies hideMap class when isHidden is true', () => {
    const { container } = render(<MapComponent isHidden />)

    const element = container.querySelector('[class*="_hideMap"]')

    expect(element).toBeInTheDocument()
  })

  it('sets up a Leaflet map instance when it does not exist already and container exists', () => {
    const containerRef = { current: 'not-null' }
    const createdMapInstanceRef = { current: false }
    ;(useRef as Mock).mockReturnValueOnce(containerRef).mockReturnValue(createdMapInstanceRef)

    const { container } = render(<MapComponent />)

    const leafletContainer = container.querySelector('[class*="leaflet-container"]')
    expect(leafletContainer).toBeInTheDocument()
  })

  it('calls invalidateSize and viewreset when isHidden prop changes', () => {
    const mockMapInstance = {
      fire: vi.fn(),
      invalidateSize: vi.fn(),
    } as unknown as Map

    const { rerender } = render(<MapComponent isHidden={false} testMapInstance={mockMapInstance} />)
    rerender(<MapComponent isHidden={true} />)

    expect(mockMapInstance.invalidateSize).toHaveBeenCalled()
    expect(mockMapInstance.fire).toHaveBeenCalledWith('viewreset')
  })

  it('exposes invalidateSize on mapHandleRef', () => {
    const mockMapInstance = {
      fire: vi.fn(),
      invalidateSize: vi.fn(),
    } as unknown as Map

    const mapHandleRef: RefObject<{ invalidateSize: () => void } | null> = { current: null }

    render(<MapComponent mapHandleRef={mapHandleRef} testMapInstance={mockMapInstance} />)

    mapHandleRef.current?.invalidateSize()

    expect(mockMapInstance.invalidateSize).toHaveBeenCalled()
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
