import { Radio as ADSRadio, Column, ErrorMessage } from '@amsterdam/design-system-react'

import { MarkdownToHtml } from '@meldingen/markdown-to-html'
import { FieldSet } from '@meldingen/ui'

import { getAriaDescribedBy } from '../../utils'

const getDateOptions = (dayRange: number) => {
  const today = new Date()

  const dateEntries = Array.from({ length: dayRange }, (_, i) => {
    const date = new Date(today)
    date.setDate(today.getDate() - i)

    const converted_date = date.toISOString().split('T')[0]

    const dayName = date.toLocaleString('nl-NL', { weekday: 'long' })
    const day = date.getDate()
    const month = date.toLocaleString('nl-NL', { month: 'long' })

    const capitalizedDayName = dayName.charAt(0).toUpperCase() + dayName.slice(1)

    const value = `day - ${i + 1}`

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

export type Props = {
  dayRange: number
  defaultValue?: string
  description?: string
  errorMessage?: string
  hasHeading: boolean
  id: string
  label: string
  validate?: { required: boolean } | null
}

export const DateInput = ({
  dayRange,
  defaultValue,
  description,
  errorMessage,
  hasHeading,
  id,
  label,
  validate,
}: Props) => {
  const options = getDateOptions(dayRange)

  return (
    <FieldSet
      aria-describedby={getAriaDescribedBy(id, description, errorMessage)}
      aria-required={validate?.required ? 'true' : undefined}
      hasHeading={hasHeading}
      invalid={Boolean(errorMessage)}
      legend={label}
      optional={!validate?.required}
      role="radiogroup"
    >
      {description && (
        <MarkdownToHtml id={`${id}-description`} type="description">
          {description}
        </MarkdownToHtml>
      )}
      {errorMessage && <ErrorMessage id={`${id}-error`}>{errorMessage}</ErrorMessage>}
      <Column gap="x-small">
        {options.map(({ label: radioLabel, value }, index) => (
          <ADSRadio
            aria-required={validate?.required ? 'true' : undefined}
            defaultChecked={value === defaultValue}
            id={index === 0 ? id : undefined} // Use component id for first radio, to be able to link to it in the Invalid Form Alert
            invalid={Boolean(errorMessage)}
            key={value}
            name={id}
            value={value}
          >
            {radioLabel}
          </ADSRadio>
        ))}
      </Column>
    </FieldSet>
  )
}
