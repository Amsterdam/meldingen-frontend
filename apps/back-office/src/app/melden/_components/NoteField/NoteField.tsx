import { useTranslations } from 'next-intl'

import { RichTextEditor } from '~/app/_components'

type Props = {
  defaultValue: string
  errorMessage?: string
}

export const NoteField = ({ defaultValue, errorMessage }: Props) => {
  const t = useTranslations('melding-form.note')

  return (
    <RichTextEditor
      defaultValue={defaultValue}
      errorMessage={errorMessage}
      id="addNote"
      label={t('label')}
      name="addNote"
      optional
    />
  )
}
