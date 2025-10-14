import { AlertProps } from '@amsterdam/design-system-react'
import useIsAfterBreakpoint from '@amsterdam/design-system-react/dist/common/useIsAfterBreakpoint'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { Mock } from 'vitest'

import { SelectLocation } from './SelectLocation'
import { ENDPOINTS } from 'apps/melding-form/src/mocks/endpoints'
import { server } from 'apps/melding-form/src/mocks/node'

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

vi.mock('@amsterdam/design-system-react/dist/common/useIsAfterBreakpoint', () => ({
  default: vi.fn(),
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
    ;(useIsAfterBreakpoint as Mock).mockImplementationOnce(() => true)

    const { container } = render(<SelectLocation />)

    const SideBarBottom = container.querySelector('[class*="_hide"]')

    expect(SideBarBottom).toBeInTheDocument()

    const toggleButton = screen.getByRole('button', { name: 'Toggle' })

    await userEvent.click(toggleButton)

    const SideBarBottomVisible = container.querySelector('[class*="_hide"]')

    expect(SideBarBottomVisible).toBeInTheDocument()
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

  it('shows an address based on provided coordinates ', async () => {
    render(<SelectLocation coordinates={{ lat: 52.37239126063553, lng: 4.900905743712159 }} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('Nieuwmarkt 15, 1011JR Amsterdam')).toBeInTheDocument()
    })
  })

  it('shows a generic label if no address is found within 30 meters of the coordinates', async () => {
    server.use(
      http.get(ENDPOINTS.PDOK_REVERSE, () =>
        HttpResponse.json({
          response: {
            numFound: 0,
            docs: [],
          },
        }),
      ),
    )

    render(<SelectLocation coordinates={{ lat: 52.37239126063553, lng: 4.900905743712159 }} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('combo-box.no-address')).toBeInTheDocument()
    })
  })
})
