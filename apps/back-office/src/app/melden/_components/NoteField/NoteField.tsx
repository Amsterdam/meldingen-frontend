import { ErrorMessage, Field, Label } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'

import { getAriaDescribedBy } from '@meldingen/form-renderer'

import { RichTextEditor } from '~/app/_components'

type Props = {
  defaultValue: string
  errorMessage?: string
}

export const NoteField = ({ defaultValue, errorMessage }: Props) => {
  const t = useTranslations('melding-form.note')

  return (
    <Field invalid={Boolean(errorMessage)}>
      <Label id="addNote-label" optional>
        {t('label')}
      </Label>
      {errorMessage && <ErrorMessage id="addNote-error">{errorMessage}</ErrorMessage>}
      <RichTextEditor
        aria-describedby={getAriaDescribedBy('addNote', undefined, errorMessage)}
        aria-labelledby="addNote-label"
        defaultValue={defaultValue}
        id="addNote"
        invalid={Boolean(errorMessage)}
        name="addNote"
      />
    </Field>
  )
}
