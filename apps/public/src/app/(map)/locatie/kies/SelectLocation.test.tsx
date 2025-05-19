import { render, screen, waitFor } from '@testing-library/react'

import { SelectLocation } from './SelectLocation'

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...(typeof actual === 'object' ? actual : {}),
    useActionState: vi.fn().mockReturnValue([{}, vi.fn()]),
  }
})

describe('SelectLocation', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }),
    })
  })

  it('should render', () => {
    const { container } = render(<SelectLocation />)

    const outerWrapper = container.querySelector('div')

    waitFor(() => {
      expect(outerWrapper).toBeInTheDocument()
    })

    const sideBar = screen.getByRole('heading', { name: 'title' })
    const addressCombobox = screen.getByRole('combobox', { name: 'label' })
    const toggleButton = screen.getByRole('button', { name: 'toggle-button.list' })

    expect(sideBar).toBeInTheDocument()
    expect(addressCombobox).toBeInTheDocument()
    expect(toggleButton).toBeInTheDocument()
    expect(container.querySelector)
  })

  it('renders correct default classname', () => {
    const { container } = render(<SelectLocation />)

    const gridElement = container.querySelector('div')
    const assetList = gridElement?.querySelector(':scope > div:nth-of-type(2)')

    expect(assetList).toHaveClass('_assetList_0ef84e')
  })
})
