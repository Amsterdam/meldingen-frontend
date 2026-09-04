import type { FormDateComponentOutput } from '@meldingen/api-client'

import { DEFAULT_TIMEZONE } from '@meldingen/utils'

import type { FormOutputWithoutPanelComponents } from '../page'

const getDateComponentOptions = (dayRange?: number | null) => {
  // (Ab)use en-CA to get the date in yyyy-mm-dd format for the DEFAULT_TIMEZONE
  const todayString = new Intl.DateTimeFormat('en-CA', {
    day: '2-digit',
    month: '2-digit',
    timeZone: DEFAULT_TIMEZONE,
    year: 'numeric',
  }).format(new Date())
  const today = new Date(`${todayString}T00:00:00Z`)

  const dateEntries = Array.from({ length: dayRange ?? 0 }, (_, i) => {
    const date = new Date(today)
    // Calculate using UTC in order to prevent DST bugs
    date.setUTCDate(today.getUTCDate() - i)

    const converted_date = date.toISOString().split('T')[0]

    const dayName = date.toLocaleString('nl-NL', { timeZone: 'UTC', weekday: 'long' })
    const day = date.getUTCDate()
    const month = date.toLocaleString('nl-NL', { month: 'long', timeZone: 'UTC' })

    const capitalizedDayName = dayName.charAt(0).toUpperCase() + dayName.slice(1)

    const value = i === 0 ? 'day' : `day - ${i}`

    let label: string
    if (i === 0) {
      label = 'Vandaag'
    } else if (i === 1) {
      label = `Gisteren ${day} ${month}`
    } else {
      label = `${capitalizedDayName} ${day} ${month}`
    }

    return { converted_date, label, value }
  })

  return [...dateEntries, { converted_date: null, label: 'Weet ik niet', value: 'Unknown' }]
}

export const setDateComponentOptions = (components: FormOutputWithoutPanelComponents[]) =>
  components.map((component) => {
    if (component.type === 'date') {
      const values = getDateComponentOptions((component as FormDateComponentOutput).dayRange)
      return { ...component, values }
    }

    return component
  })
