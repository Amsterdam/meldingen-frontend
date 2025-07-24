import { type AssetFeature, ContainerFeatureType, getContainerFeatureIcon } from './getContainerFeatureIcon'

describe('getFeatureIcon', () => {
  const makeFeature = (type: ContainerFeatureType | string): AssetFeature =>
    ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [0, 0],
      },
      properties: {
        fractie_omschrijving: type,
      },
    }) as AssetFeature

  it.each([
    [ContainerFeatureType.Papier, '/afval/papier.svg'],
    [ContainerFeatureType.Glas, '/afval/glas.svg'],
    [ContainerFeatureType.Rest, '/afval/restafval.svg'],
    [ContainerFeatureType.Textiel, '/afval/textiel.svg'],
    [ContainerFeatureType.Plastic, '/afval/plastic.svg'],
    [ContainerFeatureType.GFT, '/afval/gft.svg'],
    ['UnknownType', '/afval/restafval.svg'], // default fallback
  ])('returns correct icon for type %s', (type, expectedLabel) => {
    const feature = makeFeature(type)
    const icon = getContainerFeatureIcon(feature)

    expect(icon.options.iconUrl).toBe(expectedLabel)
  })
})
