'use client'

import { ErrorMessage, Field, Heading, Label } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'
import Form from 'next/form'
import { useActionState, useEffect, useRef } from 'react'

import type { StaticFormTextAreaComponent } from '@meldingen/form-renderer'

import { MarkdownToHtml } from '@meldingen/markdown-to-html'
import { InvalidFormAlert, SubmitButton, TextInput } from '@meldingen/ui'

import { SystemErrorAlert } from '../_components/SystemErrorAlert'
import { getDocumentTitleOnError } from '../_utils/getDocumentTitleOnError'
import { BackLink } from '../../_components'
import { postContactForm } from './actions'
import { TOP_ANCHOR_ID } from 'apps/melding-form/src/constants'
import { FormState } from 'apps/melding-form/src/types'
import { getAriaDescribedBy } from 'libs/form-renderer/src/utils'

const initialState: FormState = {}

export const Contact = ({ formComponents }: { formComponents: StaticFormTextAreaComponent[] }) => {
  const invalidFormAlertRef = useRef<HTMLDivElement>(null)
  const systemErrorAlertRef = useRef<HTMLDivElement>(null)

  const [{ formData, systemError, validationErrors }, formAction] = useActionState(postContactForm, initialState)

  const t = useTranslations('contact')
  const tShared = useTranslations('shared')

  const emailLabel = formComponents[0].label
  const emailDescription = formComponents[0].description
  const emailDefaultValue = (formData?.get('email') as string | undefined) || formComponents[0].defaultValue
  const emailErrorMessage = validationErrors?.find((error) => error.key === 'email-input')?.message

  const telLabel = formComponents[1].label
  const telDescription = formComponents[1].description
  const telDefaultValue = (formData?.get('phone') as string | undefined) || formComponents[1].defaultValue
  const telErrorMessage = validationErrors?.find((error) => error.key === 'tel-input')?.message

  // Update document title when there are system or validation errors
  const documentTitle = getDocumentTitleOnError({
    hasSystemError: Boolean(systemError),
    originalDocTitle: `${t('question')} - ${tShared('organisation-name')}`,
    translateFunction: tShared,
    validationErrorCount: validationErrors?.length,
  })

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
    <>
      <title>{documentTitle}</title>
      <BackLink className="ams-mb-m" href={`/bijlage#${TOP_ANCHOR_ID}`}>
        {t('back-link')}
      </BackLink>
      <main>
        {Boolean(systemError) && <SystemErrorAlert ref={systemErrorAlertRef} />}
        {validationErrors && (
          <InvalidFormAlert
            className="ams-mb-m"
            errors={validationErrors.map((error) => ({
              id: `#${error.key}`,
              label: error.message,
            }))}
            heading={tShared('invalid-form-alert-title')}
            headingLevel={2}
            ref={invalidFormAlertRef}
          />
        )}
        <Heading className="ams-mb-s" level={1} size="level-3">
          {t('question')}
        </Heading>
        <MarkdownToHtml className="ams-mb-m">{t('description')}</MarkdownToHtml>
        <Form action={formAction} noValidate>
          <Field className="ams-mb-l" invalid={Boolean(emailErrorMessage)}>
            <Label htmlFor="email-input" optional>
              {emailLabel}
            </Label>
            {emailDescription && (
              <MarkdownToHtml id="email-input-description" type="description">
                {emailDescription}
              </MarkdownToHtml>
            )}
            {emailErrorMessage && <ErrorMessage id="email-input-error">{emailErrorMessage}</ErrorMessage>}
            <TextInput
              aria-describedby={getAriaDescribedBy('email-input', emailDescription, emailErrorMessage)}
              autoComplete="email"
              autoCorrect="off"
              defaultValue={emailDefaultValue}
              id="email-input"
              invalid={Boolean(emailErrorMessage)}
              name="email"
              size={30} // Based on this recommendation: https://design-system.service.gov.uk/patterns/email-addresses/#help-users-to-enter-a-valid-email-address
              spellCheck="false"
              type="email"
            />
          </Field>
          <Field className="ams-mb-l" invalid={Boolean(telErrorMessage)}>
            <Label htmlFor="tel-input" optional>
              {telLabel}
            </Label>
            {telDescription && (
              <MarkdownToHtml id="tel-input-description" type="description">
                {telDescription}
              </MarkdownToHtml>
            )}
            {telErrorMessage && <ErrorMessage id="tel-input-error">{telErrorMessage}</ErrorMessage>}
            <TextInput
              aria-describedby={getAriaDescribedBy('tel-input', telDescription, telErrorMessage)}
              autoComplete="tel"
              defaultValue={telDefaultValue}
              id="tel-input"
              invalid={Boolean(telErrorMessage)}
              name="phone"
              size={15}
              type="tel"
            />
          </Field>
          <SubmitButton>{t('submit-button')}</SubmitButton>
        </Form>
      </main>
    </>
  )
}
