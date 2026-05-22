import type { PropsWithChildren } from 'react'

import { cookies } from 'next/headers'

import { BackOfficeLayout } from './_components'
import { RegularLayout } from './_components'
import { COOKIES } from '~/constants'

const GeneralLayout = async ({ children }: PropsWithChildren) => {
  const cookieStore = await cookies()
  const isBackOffice = cookieStore.get(COOKIES.SOURCE)?.value === 'back-office'

  return isBackOffice ? <BackOfficeLayout>{children}</BackOfficeLayout> : <RegularLayout>{children}</RegularLayout>
}

export default GeneralLayout
