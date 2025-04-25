'use client'

import { Heading, Link, Pagination, Table } from '@amsterdam/design-system-react'
import NextLink from 'next/link'
import { AnchorHTMLAttributes } from 'react'

import { Grid } from '@meldingen/ui'

import { MeldingOutput } from 'apps/back-office/src/apiClientProxy'

import styles from './Overview.module.css'

const HEADERS = [
  { key: 'id', label: 'Id' },
  { key: 'created_at', label: 'Datum' },
  { key: 'classification', label: 'Categorie' },
  { key: 'state', label: 'Status' },
]

const getValue = (melding: MeldingOutput, key: string) => {
  switch (key) {
    case 'created_at':
      return melding.created_at
    case 'classification':
      return melding.classification
    case 'state':
      return melding.state
    default:
      return null
  }
}

type Props = {
  data: MeldingOutput[]
  meldingCount: number
  page?: number
  totalPages: number
}

const LinkComponent = (props: AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <NextLink href={props.href ? props.href : ''} legacyBehavior passHref>
    {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
    <a {...props} />
  </NextLink>
)

export const Overview = ({ data, meldingCount, page, totalPages }: Props) => {
  return (
    <Grid paddingBottom="large" paddingTop="medium">
      <Grid.Cell span={{ narrow: 4, medium: 8, wide: 12 }}>
        <Heading level={1} className="ams-mb-m">{`Meldingen (${meldingCount})`}</Heading>
        <Table className="ams-mb-l">
          <Table.Header>
            <Table.Row>
              {HEADERS.map((header) => (
                <Table.HeaderCell key={header.key}>{header.label}</Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((melding) => (
              <Table.Row key={melding.id}>
                {HEADERS.map((header) => {
                  if (header.key === 'id') {
                    return (
                      <Table.Cell key={header.key}>
                        <NextLink href={`/melding/${melding.id}`} legacyBehavior passHref>
                          <Link variant="inline">{melding.id}</Link>
                        </NextLink>
                      </Table.Cell>
                    )
                  }
                  return <Table.Cell key={header.key}>{getValue(melding, header.key)}</Table.Cell>
                })}
              </Table.Row>
            ))}
          </Table.Body>
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
