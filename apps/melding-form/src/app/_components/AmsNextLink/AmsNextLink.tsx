import type { IconProps } from '@amsterdam/design-system-react'
import type { ComponentProps } from 'react'

import { clsx } from 'clsx'
import NextLink from 'next/link'

import { Icon } from '@meldingen/ui'

type Props = ComponentProps<typeof NextLink> & {
  icon?: IconProps['svg']
  variant?: 'link' | 'standalone-link-with-icon' | 'menu-link'
}

/*
 * Use classNames to apply Amsterdam Design System link styling to NextLink.
 * Using a className avoids issues caused by the `legacyBehavior` prop.
 * We should update or remove this component when Next offers a better way to do this.
 * See: https://github.com/vercel/next.js/discussions/76329#discussioncomment-14487168
 */
const getClassNames = (variant: Props['variant']) => {
  switch (variant) {
    case 'menu-link':
      return 'ams-menu__link'
    case 'standalone-link-with-icon':
      return 'ams-standalone-link ams-standalone-link--with-icon'
    case 'link':
    default:
      return 'ams-link'
  }
}

export const AmsNextLink = ({ children, className, icon, variant, ...restProps }: Props) => (
  <NextLink className={clsx(getClassNames(variant), className)} {...restProps}>
    {icon && <Icon className={variant === 'menu-link' ? 'ams-menu__icon' : undefined} svg={icon} />}
    {children}
  </NextLink>
)
