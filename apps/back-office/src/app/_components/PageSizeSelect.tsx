'use client'

import type { ChangeEventHandler } from 'react'

import { Field, Label, Select } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

import { ALLOWED_PAGE_SIZES, COOKIES } from '../../constants'

import styles from './PageSizeSelect.module.css'

const writePageSizeCookie = (value: number) => {
  document.cookie = `${COOKIES.PAGE_SIZE}=${value}; path=/`
}

type Props = {
  page?: number
  pageSize: number
}

export const PageSizeSelect = ({ page, pageSize }: Props) => {
  const router = useRouter()
  const t = useTranslations('overview.pagination')

  const onChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    const selected = parseInt(event.target.value, 10)

    writePageSizeCookie(selected)

    if (page && page > 1) {
      router.push('/')
      return
    }

    // Refresh the page to fetch data with the new page size.
    router.refresh()
  }

  return (
    <Field className={styles.selector}>
      <Label className={styles.selectorLabel} htmlFor="page-size">
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
