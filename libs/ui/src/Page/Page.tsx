'use client'

import { Page as ADSPage, PageProps } from '@amsterdam/design-system-react/dist/Page'
import { useEffect } from 'react'

export const Page = (props: PageProps) => {
  /*
   * Add a class to the body element when JavaScript is enabled,
   * to be able to handle cases where it is not.
   * For more information, see https://gds.blog.gov.uk/2013/10/21/how-many-people-are-missing-out-on-javascript-enhancement/
   * A global class works faster in Next.JS than adding it in the component itself,
   * which prevents a flash of the non-JS content.
   */
  useEffect(() => {
    document.body.classList.add('js-enabled')
  }, [])

  return <ADSPage {...props} />
}
