import { render, screen } from '@testing-library/react'

import { SelectLocation } from './SelectLocation'

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...(typeof actual === 'object' ? actual : {}),
    useActionState: vi.fn().mockReturnValue([{}, vi.fn()]),
  }
})

vi.mock('@amsterdam/design-system-react/dist/common/useIsAfterBreakpoint', () => ({
  default: vi.fn().mockReturnValue(true),
}))

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

    expect(outerWrapper).toBeInTheDocument()

    const sideBar = screen.getByRole('heading', { name: 'title' })
    const addressCombobox = screen.getByRole('combobox', { name: 'label' })
    const toggleButton = screen.queryByRole('button', { name: 'toggle-button.list' })

    expect(sideBar).toBeInTheDocument()
    expect(addressCombobox).toBeInTheDocument()
    expect(toggleButton).not.toBeInTheDocument()
  })

  it('renders correct default classname', () => {
    const { container } = render(<SelectLocation />)

    const gridElement = container.querySelector('div')
    const assetList = gridElement?.querySelector(':scope > div:nth-of-type(2)')

    expect(assetList).toHaveClass(/assetList/)
  })
})
