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
 * Returns a formatted Dutch date and time string.
 * @param dateString The date string to format.
 * @returns The formatted date and time as a single string.
 */
export const getFormattedDateString = (dateString: string) => {
  const { date, time } = formatDateString(dateString, formatDateStringOptions)
  return `${date} ${time}`
}
