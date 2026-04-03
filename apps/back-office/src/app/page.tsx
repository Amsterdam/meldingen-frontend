import { getTranslations } from 'next-intl/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { COOKIES } from '../constants'
import { handleApiError } from '../handleApiError'
import { Overview } from './Overview'
import { getMelding } from 'apps/back-office/src/apiClientProxy'

export const generateMetadata = async () => {
  const t = await getTranslations('overview')

  return {
    title: t('metadata.title'),
  }
}

type Props = {
  searchParams: Promise<{ pagina?: string }>
}

const DEFAULT_PAGE_SIZE = 10

const SORT = '["created_at","DESC"]'

const getPageSizeFromCookie = async (): Promise<number> => {
  const cookieStore = await cookies()
  const value = cookieStore.get(COOKIES.PAGE_SIZE)?.value

  if (!value) return DEFAULT_PAGE_SIZE

  return parseInt(value, 10)
}

export default async ({ searchParams }: Props) => {
  const pageString = (await searchParams).pagina
  const page = !pageString ? undefined : parseInt(pageString, 10)
  const pageSize = await getPageSizeFromCookie()

  if (page !== undefined && isNaN(page)) {
    redirect('/')
  }

  const { data, error, response } = await getMelding({
    query: { limit: pageSize, offset: page ? (page - 1) * pageSize : 0, sort: SORT },
  })

  const meldingenCountString = response.headers.get('Content-Range')?.split('/')[1]

  if (error || !meldingenCountString) return handleApiError(error)

  const meldingenCount = parseInt(meldingenCountString, 10)

  const totalPages = Math.ceil(meldingenCount / pageSize)

  if (page && page > totalPages) {
    redirect('/')
  }

  return (
    <Overview
      meldingen={data}
      meldingenCount={meldingenCount}
      page={page}
      pageSize={pageSize}
      totalPages={totalPages}
    />
  )
}
