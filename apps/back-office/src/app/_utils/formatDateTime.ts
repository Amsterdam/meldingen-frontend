export const formatDateTime = (dateString: string) => {
  const date = new Date(dateString)

  const formattedDate = date.toLocaleDateString('nl-NL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
  const formattedTime = date.toLocaleTimeString('nl-NL', {
    hour: 'numeric',
    minute: 'numeric',
  })

  return `${formattedDate} ${formattedTime}`
}
