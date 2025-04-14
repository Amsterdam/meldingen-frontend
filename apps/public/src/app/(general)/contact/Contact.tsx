'use client'

import { Alert, Heading, Label, Paragraph, TextInput } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'
import { useActionState } from 'react'

import type { StaticFormTextAreaComponentOutput } from '@meldingen/api-client'
import { MarkdownToHtml } from '@meldingen/markdown-to-html'
import { Grid, SubmitButton } from '@meldingen/ui'

import { postContactForm } from './actions'
import { BackLink } from '../_components/BackLink'

const initialState: { message?: string } = {}

export const Contact = ({ formData }: { formData: StaticFormTextAreaComponentOutput[] }) => {
  const [formState, formAction] = useActionState(postContactForm, initialState)

  const t = useTranslations('contact')

  const emailLabel = formData[0].label
  const emailDescription = formData[0].description
  const telLabel = formData[1].label
  const telDescription = formData[1].description

  return (
    <Grid paddingBottom="large" paddingTop="medium">
      <Grid.Cell span={{ narrow: 4, medium: 6, wide: 6 }} start={{ narrow: 1, medium: 2, wide: 3 }}>
        <BackLink href="/bijlage" className="ams-mb-xs">
          {t('back-link')}
        </BackLink>
        <Heading level={1} className="ams-mb-s">
          {t('step.title')}
        </Heading>
        <Heading level={2} size="level-4" className="ams-mb-xs">
          {t('title')}
        </Heading>
        <MarkdownToHtml className="ams-mb-s">{t('description')}</MarkdownToHtml>
        <form action={formAction}>
          {formState?.message && (
            <Alert headingLevel={2} severity="error" heading="Let op" className="ams-mb-s">
              <Paragraph>{formState?.message}</Paragraph>
            </Alert>
          )}
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
          />
          <SubmitButton>{t('submit-button')}</SubmitButton>
        </form>
      </Grid.Cell>
    </Grid>
  )
}
