export type FormDateStringOptions = {
  date?: Intl.DateTimeFormatOptions
  locale?: Intl.LocalesArgument
  time?: Intl.DateTimeFormatOptions
}

const DEFAULT_LOCALE: Intl.LocalesArgument = 'nl-NL'

export const formatDateString = (inputDate: string, options?: FormDateStringOptions) => {
  const newDate = new Date(inputDate)

  const locale = options?.locale ?? DEFAULT_LOCALE

  const date = newDate.toLocaleDateString(locale, options?.date)
  const time = newDate.toLocaleTimeString(locale, options?.time)

  return { date, time }
}
