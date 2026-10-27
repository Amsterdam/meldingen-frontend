import { render, waitFor } from '@testing-library/react'
import { vi } from 'vitest'

import { clearSession } from './actions'
import { TabSessionGuard } from './TabSessionGuard'
import { COOKIES } from '~/constants'

vi.mock('./actions', () => ({
  clearSession: vi.fn(),
}))

const mockLocks = (heldLockNames: string[] = []) => {
  const locks = {
    query: vi.fn().mockResolvedValue({ held: heldLockNames.map((name) => ({ name })), pending: [] }),
    request: vi.fn(),
  }

  Object.defineProperty(navigator, 'locks', { configurable: true, value: locks })

  return locks
}

describe('TabSessionGuard', () => {
  beforeEach(() => {
    sessionStorage.clear()
    document.cookie = `${COOKIES.NEW_SESSION}=; path=/; max-age=0`
  })

  afterEach(() => {
    Reflect.deleteProperty(navigator, 'locks')
  })

  it('renders null', () => {
    mockLocks()

    const { container } = render(<TabSessionGuard />)

    expect(container.firstChild).toBeNull()
  })

  it('holds a shared lock for this tab', async () => {
    const locks = mockLocks()

    render(<TabSessionGuard />)

    await waitFor(() =>
      expect(locks.request).toHaveBeenCalledWith('meldingen_session', { mode: 'shared' }, expect.any(Function)),
    )
  })

  it('clears the session in a new tab when no other tab holds the lock', async () => {
    mockLocks()

    render(<TabSessionGuard />)

    await waitFor(() => expect(clearSession).toHaveBeenCalled())
  })

  it('removes the tab marker when clearing the session fails, so a refresh tries again', async () => {
    vi.mocked(clearSession).mockRejectedValueOnce(new Error('Network error'))
    mockLocks()

    render(<TabSessionGuard />)

    await waitFor(() => expect(sessionStorage.getItem('meldingen_tab')).toBeNull())
    expect(clearSession).toHaveBeenCalled()
  })

  it('keeps the tab marker when clearing the session succeeds', async () => {
    mockLocks()

    render(<TabSessionGuard />)

    await waitFor(() => expect(clearSession).toHaveBeenCalled())
    expect(sessionStorage.getItem('meldingen_tab')).toBe('true')
  })

  it('keeps the session in a new tab when another tab holds the lock', async () => {
    const locks = mockLocks(['meldingen_session'])

    render(<TabSessionGuard />)

    await waitFor(() => expect(locks.request).toHaveBeenCalled())
    expect(clearSession).not.toHaveBeenCalled()
  })

  it('keeps the session when the tab was already open, for example after a refresh', async () => {
    sessionStorage.setItem('meldingen_tab', 'true')
    const locks = mockLocks()

    render(<TabSessionGuard />)

    await waitFor(() => expect(locks.request).toHaveBeenCalled())
    expect(clearSession).not.toHaveBeenCalled()
  })

  it('keeps a new session from the back office and deletes the flag', async () => {
    document.cookie = `${COOKIES.NEW_SESSION}=true; path=/`
    const locks = mockLocks()

    render(<TabSessionGuard />)

    await waitFor(() => expect(locks.request).toHaveBeenCalled())
    expect(clearSession).not.toHaveBeenCalled()
    expect(document.cookie).not.toContain(COOKIES.NEW_SESSION)
  })

  it('does nothing when Web Locks are not supported', () => {
    render(<TabSessionGuard />)

    expect(clearSession).not.toHaveBeenCalled()
    expect(sessionStorage.getItem('meldingen_tab')).toBeNull()
  })
})
