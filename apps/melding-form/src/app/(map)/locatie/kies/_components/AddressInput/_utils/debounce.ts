export const debounce = <T extends unknown[]>(fn: (...args: T) => void, delay = 250) => {
  let timer: ReturnType<typeof setTimeout>

  return (...args: T) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}
