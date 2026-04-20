export const getAssetIconSVG = (assetTypeCategorie?: string, iconFolder?: string) => {
  return `/${iconFolder}/${assetTypeCategorie?.toLocaleLowerCase()}.svg`
}
