import type { Metadata } from 'next'

import { Overview } from './Overview'
import { handleApiError } from '../handleApiError'
import { PAGE_SIZE } from './constants'
import { getMelding } from 'apps/back-office/src/apiClientProxy'

export const metadata: Metadata = {
  title: 'Overzicht meldingen openbare ruimte - Gemeente Amsterdam',
}

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async ({ searchParams }: Props) => {
  const pageString = (await searchParams).pagina
  const page = Array.isArray(pageString) || !pageString ? undefined : parseInt(pageString)

  const { data, error, response } = await getMelding({
    query: { limit: PAGE_SIZE, offset: page ? (page - 1) * PAGE_SIZE : 0, sort: '["created_at","DESC"]' },
  })

  const meldingCountString = response.headers.get('Content-Range')?.split('/')[1]

  if (error || !data || !meldingCountString) return handleApiError(error)

  return <Overview data={data} meldingCount={parseInt(meldingCountString)} page={page} />
}
