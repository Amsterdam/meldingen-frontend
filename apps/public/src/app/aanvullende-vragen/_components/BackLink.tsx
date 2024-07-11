/* eslint-disable jsx-a11y/anchor-is-valid */

import { Link } from '@amsterdam/design-system-react'
import NextLink from 'next/link'

type BackLinkProps = {
  page: number
  handleClick: () => void
}

// TODO: i18n of Link label
export const BackLink = ({ page, handleClick }: BackLinkProps) => {
  // On the first page the back link navigates between different Next pages
  // On all other pages, it navigates between steps in the wizard
  if (page === 0)
    return (
      <NextLink href="/" legacyBehavior passHref>
        <Link className="ams-mb--xs">Vorige vraag</Link>
      </NextLink>
    )

  return (
    <Link href="#" className="ams-mb--xs" onClick={handleClick}>
      Vorige vraag
    </Link>
  )
}
