import type { Coordinates } from 'apps/melding-form/src/types'

export const getAddressFromCoordinates = async ({ lat, lng }: Coordinates) =>
  fetch(`https://api.pdok.nl/bzk/locatieserver/search/v3_1/reverse?lat=${lat}&lon=${lng}&rows=1&distance=30`)
    .then((res) => res.json())
    .then((result) => result.response.docs[0]?.weergavenaam)
