import { TimeInput as ADSTimeInput, Checkbox, Column, ErrorMessage } from '@amsterdam/design-system-react'

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
  onChange: (value: string) => void
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
          defaultValue={defaultValue ?? undefined}
          id={id}
          invalid={Boolean(errorMessage)}
          name={id}
          onChange={(e) => onChange(e.target.value)}
        />
        <Checkbox defaultChecked={defaultValue === null} name={`${id}-unknown`}>
          Weet ik niet
        </Checkbox>
      </Column>
    </FieldSet>
  )
}
