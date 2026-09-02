import type { FormDateStringOptions } from '~/app/_utils/formatDateString'

import { formatDateString } from '~/app/_utils/formatDateString'

const formatDateStringOptions: FormDateStringOptions = {
  date: {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  },
  time: {
    hour: 'numeric',
    minute: 'numeric',
  },
}

/**
 * Returns a formatted date string object containing `date` and `time` properties.
 * @param dateString The date string to format.
 * @returns An object containing `date` and `time` properties.
 * @example
 * const { date, time } = getFormattedDateString('2024-06-05T12:34:56Z')
 * console.log(date) // "05-06-2024"
 * console.log(time) // "12:34"
 */
export const getFormattedDateString = (dateString: string) => {
  const { date, time } = formatDateString(dateString, formatDateStringOptions)
  return `${date} ${time}`
}
