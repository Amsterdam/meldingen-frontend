import type { Coordinates } from 'apps/public/src/types'

export const getAddressFromCoordinates = async ({ lat, lng }: Coordinates) =>
  fetch(`https://api.pdok.nl/bzk/locatieserver/search/v3_1/reverse?lat=${lat}&lon=${lng}&rows=1&distance=30`)
    .then((res) => res.json())
    .then((result) => {
      if (result.response.numFound) {
        return {
          id: result.response.docs[0].id,
          weergave_naam: result.response.docs[0].weergavenaam,
        }
      }
      return {
        id: undefined,
        weergave_naam: 'Locatie pin op kaart',
      }
    })
    // TODO: add generic error handling
    // eslint-disable-next-line no-console
    .catch((error) => console.error('Error:', error))
