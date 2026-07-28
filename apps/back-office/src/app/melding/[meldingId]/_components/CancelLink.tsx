import type { LinkProps } from '@amsterdam/design-system-react'

import { clsx } from 'clsx'
import NextLink from 'next/link'

import { Link } from '@meldingen/ui'

import styles from './CancelLink.module.css'

export const CancelLink = ({ className, ...restProps }: LinkProps) => (
  <Link {...restProps} className={clsx(className, styles.link)} linkComponent={NextLink} />
)
