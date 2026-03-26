import type { AnchorHTMLAttributes } from 'react'

import { clsx } from 'clsx'

import { AmsNextLink } from '../../../_components/AmsNextLink'

import styles from './CancelLink.module.css'

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

export const CancelLink = ({ className, href, ...restProps }: Props) => (
  <AmsNextLink className={clsx(className, styles.link)} href={href} variant="link" {...restProps} />
)
