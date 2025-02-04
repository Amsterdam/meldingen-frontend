import type { Coordinates } from 'apps/public/src/types'

export const getAddressFromCoordinates = async ({ lat, lng }: Coordinates) =>
  fetch(`https://api.pdok.nl/bzk/locatieserver/search/v3_1/reverse?lat=${lat}&lon=${lng}&rows=1`)
    .then((res) => res.json())
    .then((result) => ({
      id: result.response.docs[0].id,
      weergave_naam: result.response.docs[0].weergavenaam,
    }))
    // TODO: add generic error handling
    // eslint-disable-next-line no-console
    .catch((error) => console.error('Error:', error))
