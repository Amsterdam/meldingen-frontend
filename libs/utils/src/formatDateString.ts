export type FormDateStringOptions = {
  date?: Intl.DateTimeFormatOptions
  locale?: Intl.LocalesArgument
  time?: Intl.DateTimeFormatOptions
}

const DEFAULT_LOCALE: Intl.LocalesArgument = 'nl-NL'

export const DEFAULT_TIMEZONE = 'Europe/Amsterdam'

const DEFAULT_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: '2-digit',
  timeZone: DEFAULT_TIMEZONE,
  year: 'numeric',
}

const DEFAULT_TIME_OPTIONS: Intl.DateTimeFormatOptions = {
  hour: 'numeric',
  minute: 'numeric',
  timeZone: DEFAULT_TIMEZONE,
}

export const formatDateString = (inputDate: string, options?: FormDateStringOptions) => {
  const newDate = new Date(inputDate)

  const locale = options?.locale ?? DEFAULT_LOCALE

  const date = newDate.toLocaleDateString(locale, { ...DEFAULT_DATE_OPTIONS, ...options?.date })
  const time = newDate.toLocaleTimeString(locale, { ...DEFAULT_TIME_OPTIONS, ...options?.time })

  return { date, time }
}
