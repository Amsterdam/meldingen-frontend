import type { Map } from 'leaflet'
import type { Mock } from 'vitest'

import { render } from '@testing-library/react'
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

  it('makes the map subtree inert when requested', () => {
    const { container } = render(<MapComponent isInert />)

    const inertElement = container.querySelector('[inert]')

    expect(inertElement).toHaveAttribute('aria-hidden', 'true')
  })

  it('sets up a Leaflet map instance when it does not exist already and container exists', () => {
    const containerRef = { current: 'not-null' }
    const createdMapInstanceRef = { current: false }
    ;(useRef as Mock).mockReturnValueOnce(containerRef).mockReturnValue(createdMapInstanceRef)

    const { container } = render(<MapComponent />)

    const leafletContainer = container.querySelector('[class*="leaflet-container"]')
    expect(leafletContainer).toBeInTheDocument()
  })

  it('calls invalidateSize when hasAlert prop changes', () => {
    const mockMapInstance = {
      invalidateSize: vi.fn(),
    } as unknown as Map

    const { rerender } = render(<MapComponent hasAlert={false} testMapInstance={mockMapInstance} />)
    rerender(<MapComponent hasAlert={true} testMapInstance={mockMapInstance} />)

    expect(mockMapInstance.invalidateSize).toHaveBeenCalled()
  })

  it('calls invalidateSize and adds classname when hasAlert prop set to true', () => {
    const mockMapInstance = {
      invalidateSize: vi.fn(),
    } as unknown as Map

    const { container } = render(<MapComponent hasAlert={true} testMapInstance={mockMapInstance} />)
    const element = container.querySelector('[class*="notInteractive"]')

    expect(mockMapInstance.invalidateSize).toHaveBeenCalled()
    expect(element).toBeInTheDocument()
  })

  it('calls remove when the component unmounts', () => {
    const mockMapInstance = {
      invalidateSize: vi.fn(),
      remove: vi.fn(),
    } as unknown as Map

    const containerRef = { current: 'not-null' }
    const createdMapInstanceRef = { current: false }
    ;(useRef as Mock).mockReturnValueOnce(containerRef).mockReturnValue(createdMapInstanceRef)

    const { unmount } = render(<MapComponent testMapInstance={mockMapInstance} />)
    unmount()

    expect(mockMapInstance.remove).toHaveBeenCalled()
  })
})
