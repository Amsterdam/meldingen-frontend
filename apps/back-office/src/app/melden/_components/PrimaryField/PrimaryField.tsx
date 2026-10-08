import type { FocusEvent, TransitionStartFunction } from 'react'

import { CharacterCount, ErrorMessage, Field, Label, TextArea } from '@amsterdam/design-system-react'
import { useRef, useState } from 'react'

import type { StaticFormTextAreaComponentOutput } from '@meldingen/api-client'

import { patchMeldingByMeldingIdMelder, postMelding } from '@meldingen/api-client'
import { getAriaDescribedBy } from '@meldingen/form-renderer'
import { MarkdownToHtml } from '@meldingen/markdown-to-html'

import type { MeldingData } from '../../types'

type Props = {
  config: StaticFormTextAreaComponentOutput
  defaultValue: string
  errorMessage?: string
  existingId?: number
  existingToken?: string
  onMeldingPrefetched: (melding: MeldingData) => void
  startPrefetchingTransition: TransitionStartFunction
}

export const PrimaryField = ({
  config,
  defaultValue,
  errorMessage,
  existingId,
  existingToken,
  onMeldingPrefetched,
  startPrefetchingTransition,
}: Props) => {
  const { description, label, maxCharCount } = config

  const ref = useRef<HTMLTextAreaElement>(null)

  const [charCount, setCharCount] = useState(defaultValue.length)

  // Track the last text sent to the backend to avoid redundant blur calls
  const lastSubmittedTextRef = useRef(defaultValue)

  const handleBlur = ({ target: { value: text } }: FocusEvent<HTMLTextAreaElement>) => {
    if (!text || text === lastSubmittedTextRef.current) return

    startPrefetchingTransition(async () => {
      try {
        const { data, error } =
          existingId && existingToken
            ? await patchMeldingByMeldingIdMelder({
                body: { text },
                path: { melding_id: existingId },
                query: { token: existingToken },
              })
            : await postMelding({ body: { text } })

        if (error) throw error

        onMeldingPrefetched({
          classificationId: data.classification?.id,
          classificationName: data.classification?.name,
          createdAt: data.created_at,
          id: data.id,
          publicId: data.public_id,
          token: data.token,
        })

        lastSubmittedTextRef.current = text
      } catch (error) {
        // TODO: Log the error to an error reporting service
        // eslint-disable-next-line no-console
        console.error(error)
      }
    })
  }

  const handleOnChange = () => {
    if (typeof maxCharCount === 'number' && ref.current) {
      setCharCount(ref.current.value.length)
    }
  }

  return (
    <Field invalid={Boolean(errorMessage)}>
      <Label htmlFor="primary">{label}</Label>
      {description && (
        <MarkdownToHtml id="primary-description" type="description">
          {description}
        </MarkdownToHtml>
      )}
      {errorMessage && <ErrorMessage id="primary-error">{errorMessage}</ErrorMessage>}
      <TextArea
        aria-describedby={getAriaDescribedBy('primary', description, errorMessage)}
        aria-required="true"
        defaultValue={defaultValue}
        id="primary"
        invalid={Boolean(errorMessage)}
        name="primary"
        onBlur={handleBlur}
        onChange={handleOnChange}
        ref={ref}
        rows={4}
      />
      {maxCharCount && <CharacterCount length={charCount} maxLength={maxCharCount} />}
    </Field>
  )
}
