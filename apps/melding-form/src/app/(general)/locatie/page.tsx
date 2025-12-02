import { cookies } from 'next/headers'

import { getMeldingByMeldingIdAssetsMelder } from '@meldingen/api-client'

import { Location } from './Location'
import { COOKIES } from 'apps/melding-form/src/constants'

export default async () => {
  const cookieStore = await cookies()
  // We check for the existence of these cookies in our proxy, so non-null assertion is safe here.
  const meldingId = cookieStore.get(COOKIES.ID)!.value
  const token = cookieStore.get(COOKIES.TOKEN)!.value

  const address = cookieStore.get(COOKIES.ADDRESS)?.value
  const prevPage = cookieStore.get(COOKIES.LAST_PANEL_PATH)

  const { data } = await getMeldingByMeldingIdAssetsMelder({
    path: {
      melding_id: parseInt(meldingId, 10),
    },
    query: { token },
  })

  return <Location address={address} assetList={data} prevPage={prevPage ? prevPage.value : '/'} />
}
