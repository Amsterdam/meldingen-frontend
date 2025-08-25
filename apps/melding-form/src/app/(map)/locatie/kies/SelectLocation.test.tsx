import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { SelectLocation } from './SelectLocation'
import { containerAssets } from 'apps/melding-form/src/mocks/data'

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...(typeof actual === 'object' ? actual : {}),
    useActionState: vi.fn().mockReturnValue([{}, vi.fn()]),
  }
})

vi.mock('./_components/Map/Map', () => ({
  Map: vi.fn(({ setAssetList }) => {
    setAssetList?.(containerAssets) // call it immediately
    return <div>Map</div>
  }),
}))

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

    waitFor(() => {
      expect(outerWrapper).toBeInTheDocument()
    })

    const sideBar = screen.getByRole('heading', { name: 'title' })
    const addressCombobox = screen.getByRole('combobox', { name: 'label' })
    const toggleButton = screen.queryByRole('button', { name: 'toggle-button.list' })

    expect(sideBar).toBeInTheDocument()
    expect(addressCombobox).toBeInTheDocument()
    expect(toggleButton).not.toBeInTheDocument()
    expect(container.querySelector)
  })

  it('renders correct default classname', () => {
    const { container } = render(<SelectLocation />)

    const gridElement = container.querySelector('div')
    const assetList = gridElement?.querySelector(':scope > div:nth-of-type(2)')

    expect(assetList).toHaveClass(/assetList/)
  })

  it('should render the submit button and toggle button', async () => {
    render(<SelectLocation />)

    const button = screen.getByRole('button', { name: 'submit-button.mobile' })

    await waitFor(() => {
      expect(button).toBeInTheDocument()
    })

    const toggleButton = screen.getByRole('button', { name: 'toggle-button.list' })

    expect(toggleButton).toBeInTheDocument()
  })

  it('should handle toggle button correctly', async () => {
    render(<SelectLocation />)

    const button = screen.getByRole('button', { name: 'submit-button.mobile' })

    await waitFor(() => {
      expect(button).toBeInTheDocument()
    })

    const toggleButton = screen.getByRole('button', { name: 'toggle-button.list' })

    expect(toggleButton).toBeInTheDocument()

    await userEvent.click(toggleButton)

    const toggleButtonMap = screen.getByRole('button', { name: 'toggle-button.map' })

    expect(toggleButtonMap).toBeInTheDocument()
  })
})
