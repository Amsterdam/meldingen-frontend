'use client'

import { Heading, Link, Pagination, Table } from '@amsterdam/design-system-react'
import NextLink from 'next/link'
import { useTranslations } from 'next-intl'
import { AnchorHTMLAttributes } from 'react'

import { Grid } from '@meldingen/ui'

import { MeldingOutput } from 'apps/back-office/src/apiClientProxy'

import styles from './Overview.module.css'

const getValue = (melding: MeldingOutput, key: string) => {
  switch (key) {
    case 'created_at':
      return new Date(melding.created_at).toLocaleDateString('nl-NL')
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
  const t = useTranslations('overview')

  const headers = [
    { key: 'id', label: t('column-header.id') },
    { key: 'created_at', label: t('column-header.created_at') },
    { key: 'classification', label: t('column-header.classification') },
    { key: 'state', label: t('column-header.state') },
  ]

  return (
    <Grid paddingBottom="large" paddingTop="medium">
      <Grid.Cell span={{ narrow: 4, medium: 8, wide: 12 }}>
        <Heading level={1} className="ams-mb-m">
          {t('title', { meldingCount })}
        </Heading>
        <Table className="ams-mb-l">
          <Table.Header>
            <Table.Row>
              {headers.map((header) => (
                <Table.HeaderCell key={header.key}>{header.label}</Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((melding) => (
              <Table.Row key={melding.id}>
                {headers.map((header) => {
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
