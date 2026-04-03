export const mergeUnknownTimeAnswers = (entries: [string, string | string[]][]) => {
  const unknownKeys = new Set(
    entries
      .filter(([key, value]) => key.endsWith('-time-unknown') && value === 'on')
      .map(([key]) => key.replace(/-time-unknown$/, '')),
  )

  const entriesWithoutUnknownCheckboxes = entries.filter(([key]) => !key.endsWith('-time-unknown'))

  // If the key corresponds to a Time input with an "unknown" checkbox that is checked, set its value to "unknown".
  // Otherwise, keep the original value.
  const mappedEntries = entriesWithoutUnknownCheckboxes.map(
    ([key, value]) => (unknownKeys.has(key) ? [key, 'unknown'] : [key, value]) as [string, string | string[]],
  )

  // Some browsers do not include an empty <input type="time"> in FormData.
  // In that case, the time key is absent from entries, so we add it explicitly as 'unknown'.
  const presentKeys = new Set(entriesWithoutUnknownCheckboxes.map(([key]) => key))
  const missingUnknownEntries = [...unknownKeys]
    .filter((key) => !presentKeys.has(key))
    .map((key) => [key, 'unknown'] as [string, string | string[]])

  return [...mappedEntries, ...missingUnknownEntries]
}
