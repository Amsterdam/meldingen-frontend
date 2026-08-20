import { cookies } from 'next/headers'

import { getAssetsFromMelding } from '../_utils/getAssetsFromMelding'
import { postLocationForm } from './actions'
import { Location } from './Location'
import { COOKIES, TOP_ANCHOR_ID } from '~/constants'

type Args = {
  lastPanelPath: string | undefined
  meldingId: string
  source: string | undefined
  token: string
}

const getPreviousPagePath = ({ lastPanelPath, meldingId, source, token }: Args) => {
  if (lastPanelPath) return lastPanelPath

  if (source === 'back-office') {
    const params = new URLSearchParams({ id: meldingId, token })
    return `${process.env.NEXT_PUBLIC_BACK_OFFICE_BASE_URL}/melden?${params}`
  }

  return `/#${TOP_ANCHOR_ID}`
}

export default async () => {
  const cookieStore = await cookies()
  // We check for the existence of these cookies in our proxy, so non-null assertion is safe here.
  const meldingId = cookieStore.get(COOKIES.ID)!.value
  const token = cookieStore.get(COOKIES.TOKEN)!.value

  const address = cookieStore.get(COOKIES.ADDRESS)?.value
  const lastPanelPath = cookieStore.get(COOKIES.LAST_PANEL_PATH)?.value
  const source = cookieStore.get(COOKIES.SOURCE)?.value

  const previousPagePath = getPreviousPagePath({ lastPanelPath, meldingId, source, token })

  const { assets, pageConfig, requiredErrorMessage } = await getAssetsFromMelding(meldingId, token)

  const action = postLocationForm.bind(null, requiredErrorMessage)

  return (
    <Location
      action={action}
      address={address}
      pageConfig={pageConfig}
      prevPage={previousPagePath}
      selectedAssets={assets}
    />
  )
}
