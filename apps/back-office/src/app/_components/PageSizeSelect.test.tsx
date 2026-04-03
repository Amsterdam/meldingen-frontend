import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { PageSizeSelect } from './PageSizeSelect'

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
    document.cookie = ''
  })

  it('sets a cookie and resets to page 1 when changed on a later page', async () => {
    const user = userEvent.setup()

    render(<PageSizeSelect page={2} pageSize={10} />)

    const select = screen.getByLabelText('label')

    await user.selectOptions(select, '40')

    expect(document.cookie).toContain('meldingen_bo_overview_page_size=40')
    expect(router.push).toHaveBeenCalledWith('/')
  })

  it('handles invalid cookie values gracefully', async () => {
    document.cookie = 'meldingen_bo_overview_page_size=invalid'

    render(<PageSizeSelect page={1} pageSize={10} />)

    const select = screen.getByLabelText('label')
    expect(select).toHaveValue('10')
  })
})
