import useIsAfterBreakpoint from '@amsterdam/design-system-react/dist/common/useIsAfterBreakpoint'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useEffect } from 'react'
import { Mock } from 'vitest'

import { SelectLocation } from './SelectLocation'

vi.mock('./_components/AssetList/AssetList', () => ({
  AssetList: vi.fn(({ setNotificationType }) => (
    <div>
      <button onClick={() => setNotificationType('too-many-assets')}>SetNotification</button>
    </div>
  )),
}))

vi.mock('./_components/Map/Map', () => ({
  Map: vi.fn(),
}))

vi.mock('@amsterdam/design-system-react/dist/common/useIsAfterBreakpoint', () => ({
  default: vi.fn(),
}))

let useAssetLayerMock = vi.fn()

vi.mock('./hooks/useAssetLayer', () => ({
  useAssetLayer: (props: unknown) => useAssetLayerMock(props),
}))

describe('SelectLocation', () => {
  it('renders', () => {
    const { container } = render(<SelectLocation />)

    const sideBarTop = container.querySelectorAll('[class*="_container"]')[0]
    const sideBarBottom = container.querySelector('[class*="_hide"]')
    const map = container.querySelector('[class*="map"]')
    const submitButtonMobile = screen.queryByRole('button', { name: 'submit-button.mobile' })

    expect(sideBarTop).toBeInTheDocument()
    expect(sideBarBottom).toBeInTheDocument()
    expect(map).toBeInTheDocument()
    expect(submitButtonMobile).toBeInTheDocument()
  })

  it('toggles a class name on SideBarBottom', async () => {
    useAssetLayerMock.mockImplementation((props) => {
      useEffect(() => {
        props.setAssetList?.([{ id: '1' }])
      }, [])
      return { assetList: props.assetList ?? [], setAssetList: props.setAssetList ?? (() => {}) }
    })
    ;(useIsAfterBreakpoint as Mock).mockImplementationOnce(() => true)

    const { container } = render(<SelectLocation />)

    const SideBarBottom = container.querySelector('[class*="_hide"]')

    expect(SideBarBottom).toBeInTheDocument()

    const toggleButton = screen.getByRole('button', { name: 'toggle-button.list' })

    await userEvent.click(toggleButton)

    const SideBarBottomVisible = container.querySelector('[class*="_hide"]')

    expect(SideBarBottomVisible).toBeInTheDocument()
  })

  it('renders the notification when it is set in AssetList and closes on click', async () => {
    const user = userEvent.setup()
    render(<SelectLocation />)

    const setNotificationButton = screen.getByRole('button', { name: 'SetNotification' })

    await user.click(setNotificationButton)

    const notificationTitle = screen.getByText('too-many-assets.title')

    expect(notificationTitle).toBeInTheDocument()

    const closeButton = screen.getByRole('button', { name: 'too-many-assets.close-button' })

    await user.click(closeButton)

    expect(screen.queryByText('too-many-assets.title')).not.toBeInTheDocument()
  })
})

describe('Asset list toggle button', () => {
  it('renders nothing if assetList and selectedAssets are empty', () => {
    useAssetLayerMock.mockImplementation((props) => {
      useEffect(() => {
        props.setAssetList?.([])
      }, [])
      return { assetList: props.assetList ?? [], setAssetList: props.setAssetList ?? (() => {}) }
    })

    render(<SelectLocation />)

    const toggleButton = screen.queryByRole('button', { name: /toggle-button./ })

    expect(toggleButton).not.toBeInTheDocument()
  })

  it('renders a button with a "list" label when there are assets and the asset list is not shown', () => {
    useAssetLayerMock.mockImplementation((props) => {
      useEffect(() => {
        props.setAssetList?.([{ id: '1' }])
      }, [])
      return { assetList: props.assetList ?? [], setAssetList: props.setAssetList ?? (() => {}) }
    })

    render(<SelectLocation />)

    const toggleButton = screen.getByRole('button', { name: 'toggle-button.list' })

    expect(toggleButton).toBeInTheDocument()
  })

  it('renders a button with a "map" label when pressing the toggle button', async () => {
    const user = userEvent.setup()

    useAssetLayerMock.mockImplementation((props) => {
      useEffect(() => {
        props.setAssetList?.([{ id: '1' }])
      }, [])
      return { assetList: props.assetList ?? [], setAssetList: props.setAssetList ?? (() => {}) }
    })

    render(<SelectLocation />)

    const toggleButton = screen.getByRole('button', { name: 'toggle-button.list' })

    await user.click(toggleButton)

    const toggleButtonMap = screen.getByRole('button', { name: 'toggle-button.map' })

    expect(toggleButtonMap).toBeInTheDocument()
  })
})
