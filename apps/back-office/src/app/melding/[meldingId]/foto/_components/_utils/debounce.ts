type Debounced<F extends (...args: unknown[]) => void> = ((...args: Parameters<F>) => void) & {
  cancel: () => void
}

export const debounce = <F extends (...args: unknown[]) => void>(fn: F, delay: number): Debounced<F> => {
  let timer: ReturnType<typeof setTimeout> | null = null

  const debounced = function (this: ThisParameterType<F>, ...args: Parameters<F>) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  } as Debounced<F>

  debounced.cancel = () => {
    if (timer) clearTimeout(timer)
    timer = null
  }

  return debounced
}
