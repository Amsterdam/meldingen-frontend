import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { Overview } from './Overview'
import { handleApiError } from '../handleApiError'
import { getMelding } from 'apps/back-office/src/apiClientProxy'

export const metadata: Metadata = {
  title: 'Overzicht meldingen openbare ruimte - Gemeente Amsterdam',
}

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const PAGE_SIZE = 10

export default async ({ searchParams }: Props) => {
  const pageString = (await searchParams).pagina
  const page = Array.isArray(pageString) || !pageString ? undefined : parseInt(pageString, 10)

  if (page !== undefined && isNaN(page)) {
    redirect('/')
  }

  const { data, error, response } = await getMelding({
    query: { limit: PAGE_SIZE, offset: page ? (page - 1) * PAGE_SIZE : 0, sort: '["created_at","DESC"]' },
  })

  const meldingCountString = response.headers.get('Content-Range')?.split('/')[1]

  if (error || !data || !meldingCountString) return handleApiError(error)

  const meldingCount = parseInt(meldingCountString, 10)

  const totalPages = Math.ceil(meldingCount / PAGE_SIZE)

  if (page && page > totalPages) {
    redirect('/')
  }

  return <Overview data={data} meldingCount={meldingCount} page={page} totalPages={totalPages} />
}
