import { type AssetFeature, ContainerFeatureType, getContainerFeatureIcon } from './getContainerFeatureIcon'

const makeFeature = (type: ContainerFeatureType | string) =>
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

describe('containerFeatureIcons', () => {
  it.each([
    [ContainerFeatureType.Papier, '/afval/papier.svg'],
    [ContainerFeatureType.Glas, '/afval/glas.svg'],
    [ContainerFeatureType.Rest, '/afval/restafval.svg'],
    [ContainerFeatureType.Textiel, '/afval/textiel.svg'],
    [ContainerFeatureType.Plastic, '/afval/plastic.svg'],
    [ContainerFeatureType.GFT, '/afval/gft.svg'],
    ['UnknownType', '/afval/restafval.svg'],
  ])('returns correct icon for type %s', (type, expectedLabel) => {
    const feature = makeFeature(type)
    const icon = getContainerFeatureIcon(feature, false)

    expect(icon.options.iconUrl).toBe(expectedLabel)
  })

  it.each([
    [ContainerFeatureType.Papier, '/afval/papier.svg'],
    [ContainerFeatureType.Glas, '/afval/glas.svg'],
    [ContainerFeatureType.Rest, '/afval/restafval.svg'],
    [ContainerFeatureType.Textiel, '/afval/textiel.svg'],
    [ContainerFeatureType.Plastic, '/afval/plastic.svg'],
    [ContainerFeatureType.GFT, '/afval/gft.svg'],
    ['UnknownType', '/afval/restafval.svg'],
  ])('returns selected icon for type %s with correct options', (type, expectedLabel) => {
    const feature = makeFeature(type)
    const icon = getContainerFeatureIcon(feature, true)

    expect(icon.options.iconUrl).toBe(expectedLabel)
    expect(icon.options.className).toContain('selectedMarkerIconBorder')
    expect(icon.options.iconSize).toEqual([60, 60])
    expect(icon.options.iconAnchor).toEqual([34, 56])
  })
})
