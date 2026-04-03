'use client'

import type { ChangeEventHandler } from 'react'

import { Field, Label, Select } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

import { ALLOWED_PAGE_SIZES, COOKIES } from '../../constants'

import styles from './Pagination.module.css'

type AllowedPageSize = (typeof ALLOWED_PAGE_SIZES)[number]

const isAllowedPageSize = (value: number): value is AllowedPageSize =>
  ALLOWED_PAGE_SIZES.includes(value as AllowedPageSize)

const writePageSizeCookie = (value: AllowedPageSize) => {
  document.cookie = `${COOKIES.PAGE_SIZE}=${value}; path=/`
}

type Props = {
  page?: number
  pageSize: number
}

export const PageSizeSelect = ({ page, pageSize }: Props) => {
  const router = useRouter()
  const t = useTranslations('overview.navigation')

  const onChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    const selected = parseInt(event.target.value, 10)
    if (!isAllowedPageSize(selected)) return

    writePageSizeCookie(selected)

    if (page && page > 1) {
      router.push('/')
      return
    }

    router.refresh()
  }

  return (
    <Field className={styles.pageSizeSelect}>
      <Label className={styles.label} htmlFor="page-size" inFieldSet={true}>
        {t('label')}
      </Label>
      <Select id="page-size" name="page-size" onChange={onChange} value={pageSize}>
        {ALLOWED_PAGE_SIZES.map((size) => (
          <Select.Option key={size} value={size}>
            {size}
          </Select.Option>
        ))}
      </Select>
    </Field>
  )
}
