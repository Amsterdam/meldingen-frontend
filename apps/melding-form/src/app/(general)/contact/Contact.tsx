'use client'

import { Alert, ErrorMessage, Field, Heading, Label, Paragraph } from '@amsterdam/design-system-react'
import { getAriaDescribedBy } from 'libs/form-renderer/src/utils'
import Form from 'next/form'
import { useTranslations } from 'next-intl'
import { useActionState, useRef } from 'react'

import type { StaticFormTextAreaComponentOutput } from '@meldingen/api-client'
import { MarkdownToHtml } from '@meldingen/markdown-to-html'
import { InvalidFormAlert, SubmitButton, TextInput } from '@meldingen/ui'

import { postContactForm } from './actions'
import { FormHeader } from '../_components/FormHeader/FormHeader'
import { useSetFocusOnInvalidFormAlert } from '../_utils/useSetFocusOnInvalidFormAlert'
import { useUpdateDocumentTitleOnError } from '../_utils/useUpdateDocumentTitleOnError'
import { FormState } from 'apps/melding-form/src/types'

const initialState: FormState = {}

export const Contact = ({ formComponents }: { formComponents: StaticFormTextAreaComponentOutput[] }) => {
  const invalidFormAlertRef = useRef<HTMLDivElement>(null)

  const [{ formData, errorMessage, validationErrors }, formAction] = useActionState(postContactForm, initialState)

  const t = useTranslations('contact')
  const tShared = useTranslations('shared')

  const emailLabel = formComponents[0].label
  const emailDescription = formComponents[0].description
  const telLabel = formComponents[1].label
  const telDescription = formComponents[1].description

  // Set focus on InvalidFormAlert when there are validation errors
  useSetFocusOnInvalidFormAlert(invalidFormAlertRef, validationErrors)

  // Update document title when there are validation errors
  const documentTitle = useUpdateDocumentTitleOnError(t('metadata.title'), tShared, validationErrors)

  const emailErrorMessage = validationErrors?.find((error) => error.key === 'email-input')?.message
  const telErrorMessage = validationErrors?.find((error) => error.key === 'tel-input')?.message

  return (
    <>
      <title>{documentTitle}</title>
      {errorMessage && (
        <Alert role="alert" headingLevel={2} severity="error" heading="Let op" className="ams-mb-s">
          <Paragraph>{errorMessage}</Paragraph>
        </Alert>
      )}
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
      <FormHeader title={t('title')} step={t('step')} />
      <Heading level={1} size="level-4" className="ams-mb-m">
        {t('question')}
      </Heading>
      <MarkdownToHtml className="ams-mb-m">{t('description')}</MarkdownToHtml>
      <Form action={formAction} noValidate>
        <Field className="ams-mb-m" invalid={Boolean(emailErrorMessage)}>
          <Label htmlFor="email-input" optional>
            {emailLabel}
          </Label>
          {emailDescription && (
            <MarkdownToHtml id="email-input-description" type="description">
              {emailDescription}
            </MarkdownToHtml>
          )}
          {emailErrorMessage && <ErrorMessage id={'email-input-error'}>{emailErrorMessage}</ErrorMessage>}
          <TextInput
            aria-describedby={getAriaDescribedBy('email-input', emailDescription, emailErrorMessage)}
            autoComplete="email"
            autoCorrect="off"
            defaultValue={formData?.get('email') as string}
            id="email-input"
            invalid={Boolean(emailErrorMessage)}
            name="email"
            spellCheck="false"
            size={30} // Based on this recommendation: https://design-system.service.gov.uk/patterns/email-addresses/#help-users-to-enter-a-valid-email-address
            type="email"
          />
        </Field>
        <Field className="ams-mb-m" invalid={Boolean(telErrorMessage)}>
          <Label htmlFor="tel-input" optional>
            {telLabel}
          </Label>
          {telDescription && (
            <MarkdownToHtml id="tel-input-description" type="description">
              {telDescription}
            </MarkdownToHtml>
          )}
          {telErrorMessage && <ErrorMessage id={'tel-input-error'}>{telErrorMessage}</ErrorMessage>}
          <TextInput
            aria-describedby={getAriaDescribedBy('tel-input', telDescription, telErrorMessage)}
            autoComplete="tel"
            defaultValue={formData?.get('phone') as string}
            id="tel-input"
            invalid={Boolean(telErrorMessage)}
            name="phone"
            size={15}
            type="tel"
          />
        </Field>
        <SubmitButton>{t('submit-button')}</SubmitButton>
      </Form>
    </>
  )
}
