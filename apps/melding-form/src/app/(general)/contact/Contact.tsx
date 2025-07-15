'use client'

import { Alert, Heading, Label, Paragraph, TextInput } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'
import { useActionState } from 'react'

import type { StaticFormTextAreaComponentOutput } from '@meldingen/api-client'
import { MarkdownToHtml } from '@meldingen/markdown-to-html'
import { SubmitButton } from '@meldingen/ui'

import { postContactForm } from './actions'

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

      <Heading level={1} className="ams-mb-s">
        {t('step.title')}
      </Heading>

      <Heading level={2} size="level-4" className="ams-mb-xs">
        {t('title')}
      </Heading>

      <MarkdownToHtml className="ams-mb-s">{t('description')}</MarkdownToHtml>

      <form action={formAction}>
        <Label htmlFor="email-input" optional className="ams-mb-s">
          {emailLabel}
        </Label>

        {emailDescription && (
          <MarkdownToHtml id="email-input-description" type="description">
            {emailDescription}
          </MarkdownToHtml>
        )}

        <TextInput
          aria-describedby={emailDescription ? 'email-input-description' : undefined}
          name="email"
          id="email-input"
          type="email"
          autoComplete="email"
          autoCorrect="off"
          spellCheck="false"
          className="ams-mb-m"
          defaultValue={formData?.get(`email`) as string}
        />

        <Label htmlFor="tel-input" optional className="ams-mb-s">
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
          id="tel-input"
          name="phone"
          type="tel"
          defaultValue={formData?.get(`phone`) as string}
        />
        <SubmitButton>{t('submit-button')}</SubmitButton>
      </form>
    </>
  )
}
