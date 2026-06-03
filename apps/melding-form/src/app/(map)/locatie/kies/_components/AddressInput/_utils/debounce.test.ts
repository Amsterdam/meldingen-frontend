import { debounce } from './debounce'

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('calls the function after the delay', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 300)

    debounced()
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(300)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('uses 250ms as the default delay', () => {
    const fn = vi.fn()
    const debounced = debounce(fn)

    debounced()
    vi.advanceTimersByTime(249)
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('only calls the function once when invoked multiple times within the delay', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 300)

    debounced()
    debounced()
    debounced()
    vi.advanceTimersByTime(300)

    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('passes arguments to the original function', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 300)

    debounced('a', 'b')
    vi.advanceTimersByTime(300)

    expect(fn).toHaveBeenCalledWith('a', 'b')
  })

  it('uses the arguments from the last call', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 300)

    debounced('first')
    debounced('second')
    vi.advanceTimersByTime(300)

    expect(fn).toHaveBeenCalledWith('second')
  })
})
