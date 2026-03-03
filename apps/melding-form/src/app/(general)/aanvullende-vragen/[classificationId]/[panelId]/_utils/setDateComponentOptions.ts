import { FormDateComponentOutput } from '@meldingen/api-client'

import { FormOutputWithoutPanelComponents } from '../page'

const getDateComponentOptions = (dayRange: number) => {
  const today = new Date()

  const dateEntries = Array.from({ length: dayRange }, (_, i) => {
    const date = new Date(today)
    date.setDate(today.getDate() - i)

    const converted_date = date.toISOString().split('T')[0]

    const dayName = date.toLocaleString('nl-NL', { weekday: 'long' })
    const day = date.getDate()
    const month = date.toLocaleString('nl-NL', { month: 'long' })

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
