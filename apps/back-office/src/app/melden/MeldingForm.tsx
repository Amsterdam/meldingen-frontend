'use client'

import {
  Button,
  CharacterCount,
  ErrorMessage,
  Field,
  FieldSet,
  Grid,
  Heading,
  Label,
  Radio,
  TextArea,
} from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'
import Form from 'next/form'
import { useActionState, useEffect, useRef, useState } from 'react'

import type { StaticFormTextAreaComponentOutput } from '@meldingen/api-client'

import { getAriaDescribedBy } from '@meldingen/form-renderer'
import { MarkdownToHtml } from '@meldingen/markdown-to-html'
import { Column } from '@meldingen/ui'

import type { FormState } from './actions'

import { InvalidFormAlert } from './_components/InvalidFormAlert'
import { SystemErrorAlert } from './_components/SystemErrorAlert'
import { URGENCY_VALUES } from '~/constants'

import styles from './MeldingForm.module.css'

type Props = {
  action: (_: unknown, formData: FormData) => Promise<FormState>
  primaryTextArea: StaticFormTextAreaComponentOutput
}

const initialState: FormState = {}

export const MeldingForm = ({ action, primaryTextArea }: Props) => {
  const invalidFormAlertRef = useRef<HTMLDivElement>(null)
  const systemErrorAlertRef = useRef<HTMLDivElement>(null)

  const { description, label, maxCharCount } = primaryTextArea

  const ref = useRef<HTMLTextAreaElement>(null)

  const [{ formData, systemError, validationErrors }, formAction] = useActionState(action, initialState)

  const primaryTextAreaDefaultValue = (formData?.get('primary') as string) ?? ''

  const [charCount, setCharCount] = useState(primaryTextAreaDefaultValue.length)

  const t = useTranslations('melding-form')
  const tShared = useTranslations('shared')

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

  return (
    <Grid as="main" className={`ams-page__area--body ${styles.main}`} gapVertical="large" paddingVertical="x-large">
      <Grid.Cell span={{ narrow: 4, medium: 6, wide: 6 }}>
        {Boolean(systemError) && <SystemErrorAlert ref={systemErrorAlertRef} />}
        {validationErrors && <InvalidFormAlert ref={invalidFormAlertRef} validationErrors={validationErrors} />}
        <Heading className="ams-mb-m" level={1}>
          {t('title')}
        </Heading>
        <Form action={formAction} noValidate>
          <Column>
            <Field invalid={Boolean(validationErrors?.length)}>
              <Label htmlFor="primary">{label}</Label>
              {description && (
                <MarkdownToHtml id="primary-description" type="description">
                  {description}
                </MarkdownToHtml>
              )}
              {validationErrors && <ErrorMessage id="primary-error">{validationErrors[0].message}</ErrorMessage>}
              <TextArea
                aria-describedby={getAriaDescribedBy('primary', description, validationErrors?.[0]?.message)}
                aria-required="true"
                defaultValue={primaryTextAreaDefaultValue}
                id="primary"
                invalid={Boolean(validationErrors?.length)}
                name="primary"
                onChange={() => {
                  if (typeof maxCharCount === 'number' && ref.current) {
                    setCharCount(ref.current.value.length)
                  }
                }}
                ref={ref}
                rows={4}
              />
              {maxCharCount && <CharacterCount length={charCount} maxLength={maxCharCount} />}
            </Field>
            <FieldSet aria-required="true" legend={t('urgency-label')} role="radiogroup">
              <Column gap="x-small">
                {URGENCY_VALUES.map((urgency) => (
                  <Radio
                    aria-required="true"
                    defaultChecked={formData ? formData.get('urgency') === String(urgency) : urgency === 0}
                    key={urgency}
                    name="urgency"
                    value={String(urgency)}
                  >
                    {tShared(`urgency.${urgency}`)}
                  </Radio>
                ))}
              </Column>
            </FieldSet>
            <Button className={styles.submit} type="submit">
              {t('submit-button')}
            </Button>
          </Column>
        </Form>
      </Grid.Cell>
    </Grid>
  )
}
