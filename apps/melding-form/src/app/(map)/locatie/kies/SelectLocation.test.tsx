import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { SelectLocation } from './SelectLocation'

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...(typeof actual === 'object' ? actual : {}),
    useActionState: vi.fn().mockReturnValue([{}, vi.fn()]),
  }
})

vi.mock('./_components/AssetListToggle/AssetListToggle', () => ({
  AssetListToggle: vi.fn(({ setShowAssetList }) => (
    <div>
      <button onClick={() => setShowAssetList(true)}>Toggle</button>
    </div>
  )),
}))

vi.mock('@amsterdam/design-system-react/dist/common/useIsAfterBreakpoint', () => ({
  default: vi.fn().mockReturnValue(false),
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

    const gridElementSecondRender = container.querySelector('div')
    const assetListWrapperClassNameSecondRender =
      gridElementSecondRender?.querySelector(':scope > div:nth-of-type(2)')?.className

    expect(assetListWrapperClassNameSecondRender).not.toContain('showAssetList')
  })

  it('renders correct default classname', () => {
    const { container } = render(<SelectLocation />)

    const gridElement = container.querySelector('div')
    const assetList = gridElement?.querySelector(':scope > div:nth-of-type(2)')

    expect(assetList).toHaveClass(/assetList/)
  })

  it('should reset showAssetList when resizing to wide screen and set correct classname when assetList is toggled', async () => {
    vi.mock('@amsterdam/design-system-react/dist/common/useIsAfterBreakpoint', () => ({
      default: vi.fn().mockReturnValue(true),
    }))

    const { container } = render(<SelectLocation />)

    const gridElement = container.querySelector('div')
    const assetListWrapperClassName = gridElement?.querySelector(':scope > div:nth-of-type(2)')?.className

    expect(assetListWrapperClassName).not.toContain('showAssetList')

    const toggleButton = screen.getByRole('button', { name: 'Toggle' })

    await userEvent.click(toggleButton)

    const gridElementSecondRender = container.querySelector('div')
    const assetListWrapperClassNameSecondRender =
      gridElementSecondRender?.querySelector(':scope > div:nth-of-type(2)')?.className

    expect(assetListWrapperClassNameSecondRender).toContain('showAssetList')
  })
})
