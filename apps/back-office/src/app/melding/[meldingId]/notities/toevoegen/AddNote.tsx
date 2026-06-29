'use client'

import {
  ActionGroup,
  Alert,
  Button,
  CharacterCount,
  ErrorMessage,
  Field,
  Grid,
  Heading,
  Label,
  Paragraph,
  TextArea,
} from '@amsterdam/design-system-react'
import { clsx } from 'clsx'
import { useTranslations } from 'next-intl'
import Form from 'next/form'
import { useActionState, useEffect, useRef, useState } from 'react'

import { getAriaDescribedBy } from '@meldingen/form-renderer'

import type { FormState } from './actions'

import { BackLink } from '../../_components/BackLink'
import { CancelLink } from '../../_components/CancelLink'
import { postAddNoteForm } from './actions'

import styles from './AddNote.module.css'

type Props = {
  meldingId: number
}

const initialState: FormState = {}

const MAX_NOTE_LENGTH = 3000

export const AddNote = ({ meldingId }: Props) => {
  const errorAlertRef = useRef<HTMLDivElement>(null)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const postAddNoteFormWithMeldingId = postAddNoteForm.bind(null, { meldingId })

  const [{ systemError, textFromAction, validationErrors }, formAction] = useActionState(
    postAddNoteFormWithMeldingId,
    initialState,
  )

  const t = useTranslations('add-note')

  const textErrorMessage = validationErrors?.find((error) => error.key === 'text')?.message
  const textToDisplay = textFromAction ?? ''

  const [charCount, setCharCount] = useState(textToDisplay.length)

  useEffect(() => {
    setCharCount(textToDisplay.length)
  }, [textToDisplay])

  useEffect(() => {
    if (!validationErrors?.length && !systemError) return

    if (systemError) {
      // TODO: Log the error to an error reporting service
      // eslint-disable-next-line no-console
      console.error(systemError)
    }

    if (errorAlertRef.current) {
      errorAlertRef.current.focus()
    }
  }, [systemError, validationErrors])

  let documentTitle = t('metadata.title')

  if (textErrorMessage) {
    documentTitle = `${textErrorMessage} - ${t('metadata.title')}`
  } else if (systemError) {
    documentTitle = `${t('errors.system.heading')} - ${t('metadata.title')}`
  }

  return (
    <div className="ams-page__area--body">
      <title>{documentTitle}</title>
      <BackLink href={`/melding/${meldingId}`}>{t('back-link')}</BackLink>
      <Grid as="main" gapVertical="large">
        <Grid.Cell appearance="transparent" span={{ narrow: 4, medium: 6, wide: 6 }}>
          {(validationErrors?.length || systemError) && (
            <Alert
              className={clsx('ams-mb-m', styles.alert)}
              heading={
                systemError
                  ? t('errors.system.heading')
                  : validationErrors?.find((error) => error.key === 'text')?.message
                    ? t('errors.validation.heading')
                    : t('errors.system.heading')
              }
              headingLevel={2}
              ref={errorAlertRef}
              role="alert"
              severity="error"
              tabIndex={-1}
            >
              <Paragraph>
                {systemError
                  ? systemError
                  : validationErrors?.find((error) => error.key === 'text')?.message
                    ? validationErrors.find((error) => error.key === 'text')?.message
                    : ''}
              </Paragraph>
            </Alert>
          )}

          <Heading className="ams-mb-m" level={1}>
            {t('title')}
          </Heading>

          <Form action={formAction} noValidate>
            <Field className={clsx(styles.whiteField, 'ams-mb-m')} invalid={Boolean(textErrorMessage)}>
              <Label htmlFor="text">{t('label')}</Label>
              {textErrorMessage && <ErrorMessage id="text-error">{textErrorMessage}</ErrorMessage>}
              <TextArea
                aria-describedby={getAriaDescribedBy('text', undefined, textErrorMessage)}
                aria-required="true"
                defaultValue={textToDisplay}
                id="text"
                invalid={Boolean(textErrorMessage)}
                key={textToDisplay}
                maxLength={MAX_NOTE_LENGTH}
                minLength={1}
                name="text"
                onChange={() => {
                  if (textAreaRef.current) {
                    setCharCount(textAreaRef.current.value.length)
                  }
                }}
                ref={textAreaRef}
                rows={8}
              />
              <CharacterCount length={charCount} maxLength={MAX_NOTE_LENGTH} />
            </Field>

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
