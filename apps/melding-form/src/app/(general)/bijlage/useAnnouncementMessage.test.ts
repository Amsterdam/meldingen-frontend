import { act, renderHook } from '@testing-library/react'

import type { Announcement } from '@meldingen/file-upload'

import { ANNOUNCEMENT_CLEAR_DELAY_MS, useAnnouncementMessage } from './useAnnouncementMessage'

const deleted: Announcement = { events: [{ fileNames: ['a.png'], type: 'deleted' }], id: 1 }

describe('useAnnouncementMessage', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns no message when there is no announcement', () => {
    const { result } = renderHook(() => useAnnouncementMessage(undefined, () => 'text'))

    expect(result.current).toBeUndefined()
  })

  it('returns the text and id of the announcement', () => {
    const { result } = renderHook(() =>
      useAnnouncementMessage(deleted, ({ events }) => `${events[0].fileNames[0]} deleted`),
    )

    expect(result.current).toEqual({ id: 1, text: 'a.png deleted' })
  })

  it('keeps the text of an announcement when the text would change on a later render', () => {
    let fileCount = 1

    const { rerender, result } = renderHook(() => useAnnouncementMessage(deleted, () => `${fileCount} files`))

    fileCount = 2
    rerender()

    expect(result.current?.text).toBe('1 files')
  })

  it('creates a new text for a new announcement', () => {
    const { rerender, result } = renderHook(
      ({ announcement }) => useAnnouncementMessage(announcement, ({ id }) => `message ${id}`),
      { initialProps: { announcement: deleted } },
    )

    rerender({ announcement: { ...deleted, id: 2 } })

    expect(result.current).toEqual({ id: 2, text: 'message 2' })
  })

  it('clears the message after the clear delay', () => {
    const { result } = renderHook(() => useAnnouncementMessage(deleted, () => 'text'))

    act(() => {
      vi.advanceTimersByTime(ANNOUNCEMENT_CLEAR_DELAY_MS - 1)
    })

    expect(result.current).toBeDefined()

    act(() => {
      vi.advanceTimersByTime(1)
    })

    expect(result.current).toBeUndefined()
  })

  it('restarts the clear delay for a new announcement', () => {
    const { rerender, result } = renderHook(
      ({ announcement }) => useAnnouncementMessage(announcement, ({ id }) => `message ${id}`),
      { initialProps: { announcement: deleted } },
    )

    act(() => {
      vi.advanceTimersByTime(ANNOUNCEMENT_CLEAR_DELAY_MS - 1)
    })

    rerender({ announcement: { ...deleted, id: 2 } })

    act(() => {
      vi.advanceTimersByTime(1)
    })

    expect(result.current).toEqual({ id: 2, text: 'message 2' })
  })
})
