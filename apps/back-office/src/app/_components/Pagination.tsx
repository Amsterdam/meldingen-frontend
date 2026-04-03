import { useTranslations } from 'next-intl'
import NextLink from 'next/link'

import { Pagination as ADSPagination, Paragraph } from '@meldingen/ui'

import { PageSizeSelect } from './PageSizeSelect'

import styles from './Pagination.module.css'

type Props = {
  page?: number
  pageSize: number
  totalPages: number
}

export const Pagination = ({ page, pageSize, totalPages }: Props) => {
  const t = useTranslations('overview.navigation')

  return (
    <div className={styles.wrapper}>
      {totalPages > 1 && (
        <Paragraph className={styles.description}>
          {t('current-page', { currentPage: page ?? 1, totalPages })}
        </Paragraph>
      )}
      <ADSPagination
        className={styles.pagination}
        linkComponent={({ href = '/', ...props }) => <NextLink href={href} {...props} />}
        linkTemplate={(page) => (page === 1 ? '/' : `/?pagina=${page}`)}
        nextLabel={t('next')}
        page={page}
        previousLabel={t('previous')}
        totalPages={totalPages}
      />
      <PageSizeSelect page={page} pageSize={pageSize} />
    </div>
  )
}
