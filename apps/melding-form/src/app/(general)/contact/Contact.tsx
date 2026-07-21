'use client'

import { ErrorMessage, Field, Heading, Label } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'
import Form from 'next/form'
import { useActionState, useEffect } from 'react'

import type { StaticFormTextAreaComponent } from '@meldingen/form-renderer'

import { getAriaDescribedBy } from '@meldingen/form-renderer'
import { MarkdownToHtml } from '@meldingen/markdown-to-html'
import { SubmitButton, TextInput } from '@meldingen/ui'

import type { FormState } from '~/types'

import { getDocumentTitleOnError } from '../_utils/validation'
import { BackLink } from '../../_components'
import { postContactForm } from './actions'
import { ApiErrorAlert, InvalidFormAlert } from '~/app/_components'
import { TOP_ANCHOR_ID } from '~/constants'

const initialState: FormState = {}

export const Contact = ({ formComponents }: { formComponents: StaticFormTextAreaComponent[] }) => {
  const [{ apiError, formData, validationErrors }, formAction, isPending] = useActionState(
    postContactForm,
    initialState,
  )

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

  // Update document title when there are API or validation errors
  const documentTitle = getDocumentTitleOnError({
    hasSystemError: Boolean(apiError),
    originalDocTitle: `${t('question')} - ${tShared('organisation-name')}`,
    translateFunction: tShared,
    validationErrorCount: validationErrors?.length,
  })

  useEffect(() => {
    if (apiError) {
      // TODO: Log the error to an error reporting service
      // eslint-disable-next-line no-console
      console.error(apiError)
    }
  }, [apiError])

  return (
    <>
      <title>{documentTitle}</title>
      <BackLink className="ams-mb-m" href={`/bijlage#${TOP_ANCHOR_ID}`}>
        {t('back-link')}
      </BackLink>
      <main>
        {Boolean(apiError) && <ApiErrorAlert shouldRefocus={!isPending} />}
        {validationErrors && <InvalidFormAlert errors={validationErrors} shouldFocus={!isPending} />}
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
