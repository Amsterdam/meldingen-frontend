import { ErrorMessage, Field, Label, Select } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'

import type { SourceOutput } from '@meldingen/api-client'

import { getAriaDescribedBy } from '@meldingen/form-renderer'

type Props = {
  defaultValue: string
  errorMessage?: string
  sources: SourceOutput[]
}

export const SourceField = ({ defaultValue, errorMessage, sources }: Props) => {
  const t = useTranslations('melding-form.source')

  return (
    <Field invalid={Boolean(errorMessage)}>
      <Label htmlFor="source">{t('label')}</Label>
      {errorMessage && <ErrorMessage id="source-error">{errorMessage}</ErrorMessage>}
      <Select
        aria-describedby={getAriaDescribedBy('source', undefined, errorMessage)}
        aria-required="true"
        defaultValue={defaultValue}
        id="source"
        invalid={Boolean(errorMessage)}
        // React doesn't update the defaultValue of a select element after the initial render,
        // so we use the key prop to force a remount of the select element when defaultValue changes
        key={defaultValue}
        name="source"
      >
        <Select.Option value="">{t('default')}</Select.Option>
        {sources.map((source) => (
          <Select.Option key={source.id} value={String(source.id)}>
            {source.name}
          </Select.Option>
        ))}
      </Select>
    </Field>
  )
}
