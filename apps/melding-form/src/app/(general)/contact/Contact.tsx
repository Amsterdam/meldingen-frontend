'use client'

import { Alert, Field, Heading, Label, Paragraph, TextInput } from '@amsterdam/design-system-react'
import Form from 'next/form'
import { useTranslations } from 'next-intl'
import { useActionState } from 'react'

import type { StaticFormTextAreaComponentOutput } from '@meldingen/api-client'
import { MarkdownToHtml } from '@meldingen/markdown-to-html'
import { SubmitButton } from '@meldingen/ui'

import { postContactForm } from './actions'
import { FormHeader } from '../_components/FormHeader/FormHeader'

const initialState: { errorMessage?: string; formData?: FormData } = {}

export const Contact = ({ formComponents }: { formComponents: StaticFormTextAreaComponentOutput[] }) => {
  const [{ formData, errorMessage }, formAction] = useActionState(postContactForm, initialState)

  const t = useTranslations('contact')

  const emailLabel = formComponents[0].label
  const emailDescription = formComponents[0].description
  const telLabel = formComponents[1].label
  const telDescription = formComponents[1].description

  return (
    <>
      {errorMessage && (
        <Alert role="alert" headingLevel={2} severity="error" heading="Let op" className="ams-mb-s">
          <Paragraph>{errorMessage}</Paragraph>
        </Alert>
      )}

      <FormHeader title={t('title')} step={t('step')} />

      <Heading level={1} size="level-4" className="ams-mb-m">
        {t('question')}
      </Heading>

      <MarkdownToHtml className="ams-mb-m">{t('description')}</MarkdownToHtml>

      <Form action={formAction} noValidate>
        <Field>
          <Label htmlFor="email-input" optional>
            {emailLabel}
          </Label>

          {emailDescription && (
            <MarkdownToHtml id="email-input-description" type="description">
              {emailDescription}
            </MarkdownToHtml>
          )}

          <TextInput
            aria-describedby={emailDescription ? 'email-input-description' : undefined}
            autoComplete="email"
            autoCorrect="off"
            className="ams-mb-m"
            defaultValue={formData?.get(`email`) as string}
            id="email-input"
            name="email"
            spellCheck="false"
            size={30} // Based on this recommendation: https://design-system.service.gov.uk/patterns/email-addresses/#help-users-to-enter-a-valid-email-address
            type="email"
          />
        </Field>

        <Field>
          <Label htmlFor="tel-input" optional>
            {telLabel}
          </Label>

          {telDescription && (
            <MarkdownToHtml id="tel-input-description" type="description">
              {telDescription}
            </MarkdownToHtml>
          )}

          <TextInput
            aria-describedby={telDescription ? 'tel-input-description' : undefined}
            autoComplete="tel"
            className="ams-mb-m"
            defaultValue={formData?.get(`phone`) as string}
            id="tel-input"
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
