import type { Coordinates } from 'apps/public/src/types'

export const getAddressFromCoordinates = async ({ lat, lng }: Coordinates) =>
  fetch(`https://api.pdok.nl/bzk/locatieserver/search/v3_1/reverse?lat=${lat}&lon=${lng}&rows=1&distance=30`)
    .then((res) => res.json())
    .then((result) => {
      // If there is no address within 30 meters of the location that is clicked (e.g. water or middle of a park),
      // PDOK does not return an address. Therefore we use "Pinned on map".
      if (result.response.numFound === 0) {
        return {
          id: undefined,
          weergave_naam: 'Locatie pin op kaart',
        }
      }
      return {
        id: result.response.docs[0].id,
        weergave_naam: result.response.docs[0].weergavenaam,
      }
    })
    // TODO: add generic error handling
    // eslint-disable-next-line no-console
    .catch((error) => console.error('Error:', error))
