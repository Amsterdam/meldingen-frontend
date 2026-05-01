import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { PageSizeSelect } from './PageSizeSelect'
import { COOKIES } from '~/constants'

const router = {
  push: vi.fn(),
  refresh: vi.fn(),
}

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
  useRouter: () => router,
}))

describe('PageSizeSelect', () => {
  beforeEach(() => {
    router.push.mockReset()
    router.refresh.mockReset()
    document.cookie = `${COOKIES.PAGE_SIZE}=10; expires=Thu, 01 Jan 1970 00:00:00 GMT`
  })

  it('sets a cookie and resets to page 1 when changed on a later page', async () => {
    const user = userEvent.setup()

    render(<PageSizeSelect page={2} pageSize={10} />)

    const select = screen.getByRole('combobox', { name: 'label' })

    await user.selectOptions(select, '40')

    expect(document.cookie).toContain('meldingen_bo_overview_page_size=40')
    expect(router.push).toHaveBeenCalledWith('/')
    expect(router.refresh).not.toHaveBeenCalled()
  })

  it('sets a cookie and refreshes the current page when changed on the first page', async () => {
    const user = userEvent.setup()

    render(<PageSizeSelect page={1} pageSize={10} />)

    const select = screen.getByRole('combobox', { name: 'label' })
    await user.selectOptions(select, '20')

    expect(document.cookie).toContain('meldingen_bo_overview_page_size=20')
    expect(router.refresh).toHaveBeenCalled()
    expect(router.push).not.toHaveBeenCalled()
  })
})
