'use client'

import { Heading, Link, Pagination, Table } from '@amsterdam/design-system-react'
import NextLink from 'next/link'
import { useTranslations } from 'next-intl'
import { AnchorHTMLAttributes } from 'react'

import { Grid } from '@meldingen/ui'

import { MeldingOutput } from 'apps/back-office/src/apiClientProxy'

import styles from './Overview.module.css'

type Props = {
  data: MeldingOutput[]
  meldingCount: number
  page?: number
  totalPages: number
}

const HEADERS = [
  { key: 'public_id', labelKey: 'column-header.public_id' },
  { key: 'created_at', labelKey: 'column-header.created_at' },
  { key: 'classification', labelKey: 'column-header.classification' },
  { key: 'state', labelKey: 'column-header.state' },
]

const formatValue = (melding: MeldingOutput, key: string) => {
  switch (key) {
    case 'created_at':
      return new Date(melding.created_at).toLocaleDateString('nl-NL')
    case 'classification':
      return melding.classification?.name
    case 'state':
      return melding.state
    default:
      return null
  }
}

const LinkComponent = (props: AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <NextLink href={props.href || ''} legacyBehavior passHref>
    {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
    <a {...props} />
  </NextLink>
)

const renderTableHeaders = (headers: typeof HEADERS, t: (key: string) => string) =>
  headers.map(({ key, labelKey }) => <Table.HeaderCell key={key}>{t(labelKey)}</Table.HeaderCell>)

const renderTableRows = (data: MeldingOutput[], headers: typeof HEADERS) =>
  data.map((melding) => (
    <Table.Row key={melding.public_id}>
      {headers.map(({ key }) => {
        if (key === 'public_id') {
          return (
            <Table.Cell key={key}>
              <NextLink href={`/melding/${melding.id}?id=${melding.public_id}`} legacyBehavior passHref>
                <Link variant="inline">{melding.public_id}</Link>
              </NextLink>
            </Table.Cell>
          )
        }
        return <Table.Cell key={key}>{formatValue(melding, key)}</Table.Cell>
      })}
    </Table.Row>
  ))

export const Overview = ({ data, meldingCount, page, totalPages }: Props) => {
  const t = useTranslations('overview')

  return (
    <Grid paddingBottom="large" paddingTop="medium">
      <Grid.Cell span={{ narrow: 4, medium: 8, wide: 12 }}>
        <Heading level={1} className="ams-mb-m">
          {t('title', { meldingCount })}
        </Heading>
        <Table className="ams-mb-l">
          <Table.Header>
            <Table.Row>{renderTableHeaders(HEADERS, t)}</Table.Row>
          </Table.Header>
          <Table.Body>{renderTableRows(data, HEADERS)}</Table.Body>
        </Table>
        <Pagination
          className={styles.pagination}
          linkComponent={LinkComponent}
          linkTemplate={(page) => (page === 1 ? '/' : `/?pagina=${page}`)}
          page={page}
          totalPages={totalPages}
        />
      </Grid.Cell>
    </Grid>
  )
}
