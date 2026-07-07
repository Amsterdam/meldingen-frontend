import { ErrorMessage, Field, Label, TextArea } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'

import { getAriaDescribedBy } from '@meldingen/form-renderer'

type Props = {
  defaultValue: string
  errorMessage?: string
}

export const NoteField = ({ defaultValue, errorMessage }: Props) => {
  const t = useTranslations('melding-form.note')

  return (
    <Field invalid={Boolean(errorMessage)}>
      <Label htmlFor="addNote" optional>
        {t('label')}
      </Label>
      {errorMessage && <ErrorMessage id="addNote-error">{errorMessage}</ErrorMessage>}
      <TextArea
        aria-describedby={getAriaDescribedBy('addNote', undefined, errorMessage)}
        defaultValue={defaultValue}
        id="addNote"
        invalid={Boolean(errorMessage)}
        name="addNote"
        rows={4}
      />
    </Field>
  )
}
