import { AlertProps } from '@amsterdam/design-system-react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { SelectLocation } from './SelectLocation'

const mockNotification = {
  closeButtonLabel: 'notification.close-button',
  description: 'notification.description',
  heading: 'notification.title',
  severity: 'error' as AlertProps['severity'],
}

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

vi.mock('./_components/AssetList/AssetList', () => ({
  AssetList: vi.fn(({ setNotification }) => (
    <div>
      <button onClick={() => setNotification(mockNotification)}>SetNotification</button>
    </div>
  )),
}))

vi.mock('./_components/Map/Map', () => ({
  Map: vi.fn(),
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
      default: vi.fn().mockReturnValueOnce(true),
    }))

    const { container } = render(<SelectLocation />)

    const div = container.querySelector('[class*="showAssetList"]')

    expect(div).not.toBeInTheDocument()

    const toggleButton = screen.getByRole('button', { name: 'Toggle' })

    await userEvent.click(toggleButton)

    const divWithExtraClass = container.querySelector('[class*="showAssetList"]')

    expect(divWithExtraClass).toBeInTheDocument()
  })

  it('renders the notification when it is set in AssetList and closes on click', async () => {
    const user = userEvent.setup()
    render(<SelectLocation />)

    const setNotificationButton = screen.getByRole('button', { name: 'SetNotification' })

    await user.click(setNotificationButton)

    const notificationTitle = screen.getByText('notification.title')

    expect(notificationTitle).toBeInTheDocument()

    const closeButton = screen.getByRole('button', { name: mockNotification.closeButtonLabel })

    await user.click(closeButton)

    expect(screen.queryByText('notification.title')).not.toBeInTheDocument()
  })
})
