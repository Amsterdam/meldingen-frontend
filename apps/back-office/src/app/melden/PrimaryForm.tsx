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

import { MarkdownToHtml } from '@meldingen/markdown-to-html'
import { Column } from '@meldingen/ui'

import type { FormState } from './actions'

import { getAriaDescribedBy } from 'libs/form-renderer/src/utils'

type Props = {
  action: (_: unknown, formData: FormData) => Promise<FormState>
  primaryTextArea: StaticFormTextAreaComponentOutput
}

const initialState: FormState = {}

export const PrimaryForm = ({ action, primaryTextArea }: Props) => {
  const { description, label, maxCharCount } = primaryTextArea

  const ref = useRef<HTMLTextAreaElement>(null)
  const [charCount, setCharCount] = useState(ref.current?.value.length || 0)

  const [{ formData, redirectTo, systemError, validationErrors }, formAction] = useActionState(action, initialState)

  const t = useTranslations('primary-form')

  useEffect(() => {
    if (redirectTo) {
      window.location.href = redirectTo
    }
  }, [redirectTo])

  const primaryError = validationErrors?.find((error) => error.key === 'primary')

  // TODO
  if (systemError) {
    console.error('System error:', systemError)
  }

  return (
    <Grid as="main" className="ams-page__area--body" gapVertical="large">
      <Grid.Cell span={{ narrow: 4, medium: 6, wide: 6 }}>
        <Heading className="ams-mb-m" level={1}>
          {t('title')}
        </Heading>
        <Form action={formAction} noValidate>
          <Field invalid={Boolean(primaryError)}>
            <Label htmlFor="primary">{label}</Label>
            {description && (
              <MarkdownToHtml id="primary-description" type="description">
                {description}
              </MarkdownToHtml>
            )}
            {primaryError && <ErrorMessage id="primary-error">{primaryError.message}</ErrorMessage>}
            <TextArea
              aria-describedby={getAriaDescribedBy('primary', description, primaryError?.message)}
              aria-required="true"
              defaultValue={(formData?.get('primary') as string) ?? ''} // TODO: prefill
              id="primary"
              invalid={Boolean(primaryError)}
              name="primary"
              onChange={() => setCharCount(ref.current?.value.length || 0)}
              ref={ref}
              rows={4}
            />
            {maxCharCount && <CharacterCount length={charCount} maxLength={maxCharCount} />}
          </Field>
          <FieldSet aria-required="true" legend="Wat is de urgentie?" role="radiogroup">
            <Column gap="x-small">
              <Radio aria-required="true" name="urgency" value="high">
                Hoog
              </Radio>
              <Radio aria-required="true" name="urgency" value="medium">
                Normaal
              </Radio>
              <Radio aria-required="true" name="urgency" value="low">
                Laag
              </Radio>
            </Column>
          </FieldSet>
          <Button type="submit">{t('submit-button')}</Button>
        </Form>
      </Grid.Cell>
    </Grid>
  )
}
