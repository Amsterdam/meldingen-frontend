'use client'

import { Link, Table } from '@amsterdam/design-system-react'
import NextLink from 'next/link'

import { Grid } from '@meldingen/ui'

import { MeldingOutput } from 'apps/back-office/src/apiClientProxy'

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

export const Overview = ({ data }: { data: MeldingOutput[] }) => {
  return (
    <Grid paddingBottom="large" paddingTop="medium">
      <Grid.Cell span={{ narrow: 4, medium: 8, wide: 9 }} start={{ narrow: 1, medium: 1, wide: 3 }}>
        <Table>
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
      </Grid.Cell>
    </Grid>
  )
}
