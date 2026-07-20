'use client'

import { ActionGroup, Button, Grid, Heading } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'
import Form from 'next/form'
import { useActionState, useEffect, useRef } from 'react'

import type { NoteRetrieveOutput } from '@meldingen/api-client'

import type { FormState } from '~/types'

import { BackLink } from '../../../_components/BackLink'
import { CancelLink } from '../../../_components/CancelLink'
import { postUpdateNoteForm } from './actions'
import { InvalidFormAlert, RichTextEditor, SystemErrorAlert } from '~/app/_components'

import styles from './UpdateNote.module.css'

const initialState: FormState = {}

type Props = {
  meldingId: number
  note: NoteRetrieveOutput
}

export const UpdateNote = ({ meldingId, note }: Props) => {
  const invalidFormAlertRef = useRef<HTMLDivElement>(null)
  const systemErrorAlertRef = useRef<HTMLDivElement>(null)

  const action = postUpdateNoteForm.bind(null, { meldingId, noteId: note.id })

  const [{ formData, systemError, validationErrors }, formAction] = useActionState(action, initialState)

  const t = useTranslations('update-note')

  // Set focus on InvalidFormAlert when there are validation errors
  // and on SystemErrorAlert when there is a system error
  useEffect(() => {
    if (validationErrors && invalidFormAlertRef.current) {
      invalidFormAlertRef.current.focus()
    } else if (systemError && systemErrorAlertRef.current) {
      systemErrorAlertRef.current.focus()
    }
  }, [validationErrors, systemError])

  useEffect(() => {
    if (systemError) {
      // TODO: Log the error to an error reporting service
      // eslint-disable-next-line no-console
      console.error(systemError)
    }
  }, [systemError])

  const defaultValue = formData?.get('updateNote')?.toString() ?? note.text
  const errorMessage = validationErrors?.find((error) => error.key === 'updateNote')?.message

  return (
    <div className="ams-page__area--body">
      <BackLink href={`/melding/${meldingId}`}>{t('back-link')}</BackLink>
      <Grid as="main" gapVertical="large">
        <Grid.Cell appearance="transparent" span={{ narrow: 4, medium: 6, wide: 6 }}>
          {Boolean(systemError) && <SystemErrorAlert ref={systemErrorAlertRef} />}
          {validationErrors && (
            <InvalidFormAlert
              ref={invalidFormAlertRef}
              title={t('invalid-form-alert-title')}
              validationErrors={validationErrors}
            />
          )}
          <Heading className="ams-mb-m" level={1}>
            {t('title')}
          </Heading>
          <Form action={formAction} noValidate>
            <div className={styles.whiteField}>
              <RichTextEditor
                defaultValue={defaultValue}
                errorMessage={errorMessage}
                id="updateNote"
                label={t('label')}
                labelClassName="ams-mb-s"
                name="updateNote"
              />
            </div>
            <ActionGroup>
              <Button type="submit">{t('submit-button')}</Button>
              <CancelLink href={`/melding/${meldingId}`}>{t('cancel-link')}</CancelLink>
            </ActionGroup>
          </Form>
        </Grid.Cell>
      </Grid>
    </div>
  )
}
