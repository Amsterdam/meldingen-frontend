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

Object.defineProperty(window, 'matchMedia', {
  value: vi.fn().mockImplementation(() => ({})),
})

describe('SelectLocation', () => {
  it('should render', () => {
    const { container } = render(<SelectLocation />)

    const sideBar = container.querySelector('[class*="container"]')
    const assetList = container.querySelector('[class*="assetList"]')
    const map = container.querySelector('[class*="map"]')
    const submitButtonMobile = screen.queryByRole('button', { name: 'submit-button.mobile' })

    expect(sideBar).toBeInTheDocument()
    expect(assetList).toBeInTheDocument()
    expect(map).toBeInTheDocument()
    expect(submitButtonMobile).toBeInTheDocument()
  })

  it('adds a class name to the asset list container when showAssetList is true', async () => {
    vi.mock('@amsterdam/design-system-react/dist/common/useIsAfterBreakpoint', () => ({
      default: vi.fn().mockReturnValue(true),
    }))

    const { container } = render(<SelectLocation />)

    const div = container.querySelector('[class*="showAssetList"]')

    expect(div).not.toBeInTheDocument()

    const toggleButton = screen.getByRole('button', { name: 'Toggle' })

    await userEvent.click(toggleButton)

    const divWithExtraClass = container.querySelector('[class*="showAssetList"]')

    expect(divWithExtraClass).toBeInTheDocument()
  })
})
