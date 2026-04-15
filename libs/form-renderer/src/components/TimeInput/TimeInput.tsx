import { TimeInput as ADSTimeInput, Checkbox, Column, ErrorMessage } from '@amsterdam/design-system-react'
import { useState } from 'react'

import { MarkdownToHtml } from '@meldingen/markdown-to-html'
import { FieldSet } from '@meldingen/ui'

import { getAriaDescribedBy } from '../../utils'

import styles from './TimeInput.module.css'

export type Props = {
  defaultValue?: string | null
  description?: string
  errorMessage?: string
  hasHeading: boolean
  id: string
  label: string
  onChange: (value: string | null) => void
  validate?: { required: boolean } | null
}

export const TimeInput = ({
  defaultValue,
  description,
  errorMessage,
  hasHeading,
  id,
  label,
  onChange,
  validate,
}: Props) => {
  const [isUnknown, setIsUnknown] = useState(defaultValue === null)
  const [timeValue, setTimeValue] = useState<string>(defaultValue ?? '')

  const handleTimeChange = (newValue: string) => {
    setTimeValue(newValue)
    if (newValue && isUnknown) {
      setIsUnknown(false)
    }
    onChange(newValue)
  }

  const handleCheckboxChange = (isChecked: boolean) => {
    setIsUnknown(isChecked)
    onChange(isChecked ? null : timeValue)
  }

  return (
    <FieldSet
      aria-describedby={getAriaDescribedBy(id, description, errorMessage)}
      aria-required={validate?.required ? 'true' : undefined}
      hasHeading={hasHeading}
      invalid={Boolean(errorMessage)}
      legend={label}
      optional={!validate?.required}
    >
      {description && (
        <MarkdownToHtml id={`${id}-description`} type="description">
          {description}
        </MarkdownToHtml>
      )}
      {errorMessage && <ErrorMessage id={`${id}-error`}>{errorMessage}</ErrorMessage>}
      <Column gap="small">
        <ADSTimeInput
          aria-required={validate?.required ? 'true' : undefined}
          className={styles.timeInput}
          id={id}
          invalid={Boolean(errorMessage)}
          name={id}
          onChange={(e) => handleTimeChange(e.target.value)}
          value={isUnknown ? '' : timeValue}
        />
        <Checkbox
          checked={isUnknown}
          name={`${id}-time-unknown`}
          onChange={(e) => handleCheckboxChange(e.target.checked)}
        >
          Weet ik niet
        </Checkbox>
      </Column>
    </FieldSet>
  )
}
