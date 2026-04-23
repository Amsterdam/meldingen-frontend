export const mergeUnknownTimeAnswers = (entries: [string, string][]): [string, string][] => {
  // Strip the 'time___' prefix so the returned keys match the question metadata keys
  const strippedEntries = entries.map(([key, value]) => [key.replace(/^time___/, ''), value] as [string, string])

  const unknownKeys = new Set(
    strippedEntries
      .filter(([key, value]) => key.endsWith('-unknown') && value === 'on')
      .map(([key]) => key.replace(/-unknown$/, '')),
  )

  const timeEntries = strippedEntries.filter(([key]) => !key.endsWith('-unknown'))
  const presentTimeKeys = new Set(timeEntries.map(([key]) => key))

  const result = timeEntries.map(([key, value]) => [key, unknownKeys.has(key) ? 'unknown' : value] as [string, string])

  // Some browsers do not include an empty <input type="time"> in FormData.
  // In that case, the time key is absent from entries, so we add it explicitly as 'unknown'.
  unknownKeys.forEach((key) => {
    if (!presentTimeKeys.has(key)) result.push([key, 'unknown'])
  })

  return result
}
