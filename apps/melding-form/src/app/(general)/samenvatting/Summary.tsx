'use client'

import { Heading, Paragraph } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'
import Form from 'next/form'
import NextLink from 'next/link'
import { useActionState, useEffect, useRef } from 'react'

import { Link, SubmitButton, SummaryList, UnorderedList } from '@meldingen/ui'

import { SystemErrorAlert } from '../_components/SystemErrorAlert'
import { getDocumentTitleOnError } from '../_utils/validation/getDocumentTitleOnError'
import { BackLink } from '../../_components'
import { AttachmentImage } from './_components/AttachmentImage'
import { TOP_ANCHOR_ID } from 'apps/melding-form/src/constants'
import { FormState } from 'apps/melding-form/src/types'

type GenericSummaryData = {
  description: string
  key: string
  term: string
}

type File = {
  blob: Blob
  fileName: string
}

type Props = {
  action: (_: unknown, formData: FormData) => Promise<FormState>
  additionalQuestions: (GenericSummaryData & { link: string })[]
  attachments: Omit<GenericSummaryData, 'description'> & { files: File[] }
  contact?: Omit<GenericSummaryData, 'description'> & { description: string[] }
  location: GenericSummaryData
  primaryForm: GenericSummaryData
}

const initialState: Pick<FormState, 'systemError'> = {}

export const Summary = ({ action, additionalQuestions, attachments, contact, location, primaryForm }: Props) => {
  const systemErrorAlertRef = useRef<HTMLDivElement>(null)

  const [{ systemError }, formAction] = useActionState(action, initialState)

  const t = useTranslations('summary')
  const tShared = useTranslations('shared')

  // Update document title when there are system or validation errors
  const documentTitle = getDocumentTitleOnError({
    hasSystemError: Boolean(systemError),
    originalDocTitle: `${t('main-title')} - ${tShared('organisation-name')}`,
    translateFunction: tShared,
  })

  // Set focus on SystemErrorAlert when there is a system error
  useEffect(() => {
    if (systemError && systemErrorAlertRef.current) {
      systemErrorAlertRef.current.focus()
    }
  }, [systemError])

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
      <BackLink className="ams-mb-m" href={`/contact#${TOP_ANCHOR_ID}`}>
        {t('back-link')}
      </BackLink>
      <main>
        {Boolean(systemError) && <SystemErrorAlert ref={systemErrorAlertRef} />}
        <Heading className="ams-mb-s" level={1} size="level-3">
          {t('main-title')}
        </Heading>
        <Paragraph className="ams-mb-m">{t('description')}</Paragraph>
        <SummaryList className="ams-mb-l">
          <SummaryList.Item>
            <SummaryList.Term>{primaryForm.term}</SummaryList.Term>
            <SummaryList.Description>{primaryForm.description}</SummaryList.Description>
            <SummaryList.Description>
              <NextLink href={`/#${TOP_ANCHOR_ID}`} legacyBehavior passHref>
                <Link>{t('change-links.primary')}</Link>
              </NextLink>
            </SummaryList.Description>
          </SummaryList.Item>

          {additionalQuestions.length > 0 &&
            additionalQuestions.map(({ description, key, link, term }) => (
              <SummaryList.Item key={key}>
                <SummaryList.Term>{term}</SummaryList.Term>
                <SummaryList.Description>{description}</SummaryList.Description>
                <SummaryList.Description>
                  <NextLink href={link} legacyBehavior passHref>
                    <Link>{t('change-links.additional')}</Link>
                  </NextLink>
                </SummaryList.Description>
              </SummaryList.Item>
            ))}

          <SummaryList.Item>
            <SummaryList.Term>{location.term}</SummaryList.Term>
            <SummaryList.Description>{location.description}</SummaryList.Description>
            <SummaryList.Description>
              <NextLink href={`/locatie#${TOP_ANCHOR_ID}`} legacyBehavior passHref>
                <Link>{t('change-links.location')}</Link>
              </NextLink>
            </SummaryList.Description>
          </SummaryList.Item>

          {attachments.files.length > 0 && (
            <SummaryList.Item>
              <SummaryList.Term>{attachments.term}</SummaryList.Term>
              <SummaryList.Description>
                <UnorderedList className="ams-gap-m" markers={false}>
                  {attachments.files.map(({ blob, fileName }) => (
                    <UnorderedList.Item key={fileName}>
                      <AttachmentImage blob={blob} fileName={fileName} />
                    </UnorderedList.Item>
                  ))}
                </UnorderedList>
              </SummaryList.Description>
              <SummaryList.Description>
                <NextLink href={`/bijlage#${TOP_ANCHOR_ID}`} legacyBehavior passHref>
                  <Link>{t('change-links.attachments')}</Link>
                </NextLink>
              </SummaryList.Description>
            </SummaryList.Item>
          )}

          {contact && (
            <SummaryList.Item>
              <SummaryList.Term>{contact.term}</SummaryList.Term>
              {contact.description.map((item) => (
                <SummaryList.Description key={item}>{item}</SummaryList.Description>
              ))}
              <SummaryList.Description>
                <NextLink href={`/contact#${TOP_ANCHOR_ID}`} legacyBehavior passHref>
                  <Link>{t('change-links.contact')}</Link>
                </NextLink>
              </SummaryList.Description>
            </SummaryList.Item>
          )}
        </SummaryList>

        <Form action={formAction} noValidate>
          <SubmitButton>{t('submit-button')}</SubmitButton>
        </Form>
      </main>
    </>
  )
}
