import { useTranslations } from 'next-intl'
import NextLink from 'next/link'
import { AnchorHTMLAttributes } from 'react'

import { Grid, Heading, Link, Pagination, Table } from '@meldingen/ui'

import { getShortNLAddress } from './utils'
import { MeldingOutput } from 'apps/back-office/src/apiClientProxy'

import styles from './Overview.module.css'

type Props = {
  meldingen: MeldingOutput[]
  meldingenCount: number
  page?: number
  totalPages: number
}

const HEADERS = [
  { key: 'public_id', labelKey: 'column-header.public_id' },
  { key: 'created_at', labelKey: 'column-header.created_at' },
  { key: 'classification', labelKey: 'column-header.classification' },
  { key: 'state', labelKey: 'column-header.state' },
  { key: 'address', labelKey: 'column-header.address' },
  { key: 'postal_code', labelKey: 'column-header.postal_code' },
]

type MeldingWithAddress = MeldingOutput & { address?: string }

export const formatValue = (melding: MeldingWithAddress, key: string, t: (key: string) => string) => {
  switch (key) {
    case 'address':
      return melding.address || ''
    case 'classification':
      return melding.classification ? melding.classification.name : t('overview.no-classification')
    case 'created_at':
      return new Date(melding.created_at).toLocaleDateString('nl-NL')
    case 'postal_code':
      return melding.postal_code || ''
    case 'state':
      return t(`shared.state.${melding.state}`)
    default:
      return undefined
  }
}

export const LinkComponent = (props: AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <NextLink href={props.href || ''} legacyBehavior passHref>
    {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
    <a {...props} />
  </NextLink>
)

const renderTableHeaders = (headers: typeof HEADERS, t: (key: string) => string) =>
  headers.map(({ key, labelKey }) => <Table.HeaderCell key={key}>{t(`overview.${labelKey}`)}</Table.HeaderCell>)

const renderTableRows = (meldingen: MeldingWithAddress[], headers: typeof HEADERS, t: (key: string) => string) =>
  meldingen.map((melding) => (
    <Table.Row key={melding.public_id}>
      {headers.map(({ key }) => {
        if (key === 'public_id') {
          return (
            <Table.Cell key={key}>
              <NextLink href={`/melding/${melding.id}?id=${melding.public_id}`} legacyBehavior passHref>
                <Link>{melding.public_id}</Link>
              </NextLink>
            </Table.Cell>
          )
        }
        return <Table.Cell key={key}>{formatValue(melding, key, t)}</Table.Cell>
      })}
    </Table.Row>
  ))

export const Overview = ({ meldingen, meldingenCount, page, totalPages }: Props) => {
  const t = useTranslations()

  const meldingenWithAddress = meldingen.map((melding) => ({
    ...melding,
    address: getShortNLAddress(melding),
  }))

  return (
    <Grid as="main" className="ams-page__area--body" paddingVertical="x-large">
      <Grid.Cell span="all">
        <Heading className="ams-mb-m" level={1}>
          {t('overview.title', { meldingenCount })}
        </Heading>
        <Table className="ams-mb-l">
          <Table.Header>
            <Table.Row>{renderTableHeaders(HEADERS, t)}</Table.Row>
          </Table.Header>
          <Table.Body>{renderTableRows(meldingenWithAddress, HEADERS, t)}</Table.Body>
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
