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
import { useActionState, useRef, useState } from 'react'

import type { StaticFormTextAreaComponentOutput } from '@meldingen/api-client'

import { getAriaDescribedBy } from '@meldingen/form-renderer'
import { MarkdownToHtml } from '@meldingen/markdown-to-html'
import { Column } from '@meldingen/ui'

import type { FormState } from './actions'

import { postMeldingForm } from './actions'

type Props = {
  primaryTextArea: StaticFormTextAreaComponentOutput
}

const initialState: FormState = {}

export const MeldingForm = ({ primaryTextArea }: Props) => {
  const { description, label, maxCharCount } = primaryTextArea

  const ref = useRef<HTMLTextAreaElement>(null)
  const [charCount, setCharCount] = useState(ref.current?.value.length || 0)

  const [{ formData, validationErrors }, formAction] = useActionState(postMeldingForm, initialState)

  const t = useTranslations('melding-form')

  return (
    <Grid as="main" className="ams-page__area--body" gapVertical="large">
      <Grid.Cell span={{ narrow: 4, medium: 6, wide: 6 }}>
        <Heading className="ams-mb-m" level={1}>
          {t('title')}
        </Heading>
        <Form action={formAction} noValidate>
          <Field>
            <Label htmlFor="primary">{label}</Label>
            {description && (
              <MarkdownToHtml id="primary-description" type="description">
                {description}
              </MarkdownToHtml>
            )}
            {validationErrors && <ErrorMessage>{validationErrors[0].message}</ErrorMessage>}
            <TextArea
              aria-describedby={getAriaDescribedBy('primary', description)}
              aria-required="true"
              defaultValue={(formData?.get('primary') as string) ?? ''} // TODO: prefill
              id="primary"
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
