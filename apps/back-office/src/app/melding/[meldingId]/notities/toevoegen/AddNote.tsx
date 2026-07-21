'use client'

import { ActionGroup, Button, Grid, Heading } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'
import Form from 'next/form'
import { useActionState, useEffect, useRef } from 'react'

import type { FormState } from '~/types'

import { BackLink } from '../../_components/BackLink'
import { CancelLink } from '../../_components/CancelLink'
import { postAddNoteForm } from './actions'
import { InvalidFormAlert, RichTextEditor, SystemErrorAlert } from '~/app/_components'

import styles from './AddNote.module.css'

const initialState: FormState = {}

export const AddNote = ({ meldingId }: { meldingId: number }) => {
  const systemErrorAlertRef = useRef<HTMLDivElement>(null)

  const postAddNoteFormWithMeldingId = postAddNoteForm.bind(null, { meldingId })

  const [{ formData, systemError, validationErrors }, formAction] = useActionState(
    postAddNoteFormWithMeldingId,
    initialState,
  )

  const t = useTranslations('add-note')

  // Set focus on SystemErrorAlert when there is a system error
  useEffect(() => {
    if (systemError && systemErrorAlertRef.current) {
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

  const defaultValue = formData?.get('addNote')?.toString() || ''
  const errorMessage = validationErrors?.find((error) => error.key === 'addNote')?.message

  return (
    <div className="ams-page__area--body">
      <BackLink href={`/melding/${meldingId}`}>{t('back-link')}</BackLink>
      <Grid as="main" gapVertical="large">
        <Grid.Cell appearance="transparent" span={{ narrow: 4, medium: 6, wide: 6 }}>
          {Boolean(systemError) && <SystemErrorAlert ref={systemErrorAlertRef} />}
          {validationErrors && <InvalidFormAlert errors={validationErrors} heading={t('invalid-form-alert-title')} />}
          <Heading className="ams-mb-m" level={1}>
            {t('title')}
          </Heading>
          <Form action={formAction} noValidate>
            <div className={styles.whiteField}>
              <RichTextEditor
                defaultValue={defaultValue}
                errorMessage={errorMessage}
                id="addNote"
                label={t('label')}
                labelClassName="ams-mb-s"
                name="addNote"
                required
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
