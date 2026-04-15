export const mergeUnknownTimeAnswers = (entries: [string, string | string[]][]) => {
  const unknownKeys = new Set(
    entries
      .filter(([key, value]) => key.endsWith('-unknown') && value === 'on')
      .map(([key]) => key.replace(/-unknown$/, '')),
  )

  const timeEntries = entries.filter(([key]) => !key.endsWith('-unknown'))
  const presentTimeKeys = new Set(timeEntries.map(([key]) => key))

  const result = timeEntries.map(
    ([key, value]) => [key, unknownKeys.has(key) ? 'unknown' : value] as [string, string | string[]],
  )

  // Some browsers do not include an empty <input type="time"> in FormData.
  // In that case, the time key is absent from entries, so we add it explicitly as 'unknown'.
  unknownKeys.forEach((key) => {
    if (!presentTimeKeys.has(key)) result.push([key, 'unknown'])
  })

  return result
}
