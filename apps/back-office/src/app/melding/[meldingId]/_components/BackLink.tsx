import type { AnchorHTMLAttributes } from 'react'

import { ChevronBackwardIcon } from '@amsterdam/design-system-react-icons'
import { clsx } from 'clsx'

import { AmsNextLink } from '../../../_components/AmsNextLink'

import styles from './BackLink.module.css'

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

export const BackLink = ({ className, href, ...restProps }: Props) => (
  <AmsNextLink
    className={clsx(styles.link, className)}
    href={href}
    icon={<ChevronBackwardIcon />}
    variant="standalone-link-with-icon"
    {...restProps}
  />
)
