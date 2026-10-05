# Assets

Some classifications let the user select objects in public space on the map. We call these objects **assets**. They're fetched from WFS layers and shown as markers on the map and in a list, the **asset list**. The user can select up to a maximum number of assets, and the selection is stored with the Melding.

This happens on the location picker in Melding form (`/locatie/kies`). The selected assets are shown again on `/locatie`, `/samenvatting` and in the Melding detail page in the Back Office.

## Asset types

Assets are configured per **asset type** in the Admin. An asset type is linked to a classification. If the classification has no asset type, no assets are shown.

For example, an asset type 'Waste containers' could be linked to a classification called 'Damaged waste container'. It would get its assets from a WFS layer with all waste containers in an area, so each asset is one container. Containers can be of different kinds, such as paper, glass, organic or residual waste. Each kind can get its own [icon](#icons), and each container gets its own [label](#labels), e.g. 'Paper container - 12345'.

Most settings are stored in the asset type's free-form `arguments` object:

| Field                                                                         | Purpose                                                                                                                    |
| ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `arguments.base_url`, `type_names`, `srs_name`, `filter`                      | WFS layer settings. `filter` is an XML template with `{west}`, `{south}`, `{east}`, `{north}` and `{srsName}` placeholders |
| `arguments.icon_folder`                                                       | Folder in `apps/melding-form/public/` that holds the icons for this asset type                                             |
| `arguments.icon_entry`                                                        | Name of the WFS feature property whose value selects the icon. Called "Koppelcode" in the Admin. See [Icons](#icons)       |
| `arguments.label`                                                             | Label template, e.g. `{{fractie_omschrijving}} container - {{id_nummer}}`. See [Labels](#labels)                           |
| `max_assets`                                                                  | Maximum number of assets a user can select (defaults to 3)                                                                 |
| `arguments.singular`, `plural`                                                | Names of the asset, used in notifications and the asset list. Fall back to defaults when empty                             |
| `arguments.location_label`, `location_description`, `location_required_error` | Texts on the `/locatie` page                                                                                               |
| `arguments.term`                                                              | Term used for assets in Back Office                                                                                        |

The front end never calls a WFS server directly. The back end proxies all WFS requests through `GET /asset-type/{asset_type_id}/wfs` (`getAssetTypeByAssetTypeIdWfs` in `@meldingen/api-client`). The result is a GeoJSON `FeatureCollection`, and each `Feature` is one asset.

## Selecting and saving assets

The location picker (`/locatie/kies`) shows assets both as markers on the map and in the asset list. Both share the same `selectedAssets` state, so selecting an asset in one updates the other. The selection logic is implemented in both places (`AssetList` and `useAddMarkersToMap` in `@meldingen/map`) and should behave the same.

A Melding always has one location, even when multiple assets are selected. The location is shown as an address in the address field and a coordinate is saved as the Melding's location. The map doesn't move when an asset is selected.

The rules:

- A newly selected asset is added to the front of `selectedAssets`, and the location is set to the location of that asset.
- Deselecting the first asset moves the location to the next asset in the array. Deselecting any other asset doesn't change the location. Deselecting the last remaining asset clears the location: both the coordinate and the address.

- No more than `max_assets` can be selected. Selecting more shows a notification, and the selection doesn't change.
- Picking a location without an asset (map click, current location or address) clears all selected assets.

On submit, each asset is saved with its WFS feature id, its [label](#labels) and its `subtype`: the value of the `icon_entry` property. Saving these means later pages (`/locatie`, `/samenvatting` and the Back Office detail page) can show the asset and its [icon](#icons) without calling the WFS layer again.

### Example

With `max_assets: 3`:

| Action             | `selectedAssets` | Location                      |
| ------------------ | ---------------- | ----------------------------- |
| Select container A | `[A]`            | A                             |
| Select container B | `[B, A]`         | B                             |
| Select container C | `[C, B, A]`      | C                             |
| Select container D | `[C, B, A]`      | C (notification: max reached) |
| Deselect B         | `[C, A]`         | C (unchanged)                 |
| Deselect C         | `[A]`            | A                             |
| Click on the map   | `[]`             | Clicked point                 |

## Labels

A label is constructed with values from the asset's properties using a label template. Each `{{property_name}}` placeholder is replaced by `asset.properties[property_name]`:

```ts
// label template: '{{fractie_omschrijving}} container - {{id_nummer}}'
// properties:     { fractie_omschrijving: 'Papier', id_nummer: 12345 }
// result:         'Papier container - 12345'
```

Missing properties are replaced by an empty string. If there's no template, or the result is empty, the asset's `id` is used.

## Icons

Assets don't have an icon stored with them. The icon path is built from the asset type config and the asset's own data:

```text
/{icon_folder}/{properties[icon_entry] in lowercase}.svg
```

For example, with `icon_folder: 'container'` and `icon_entry: 'fractie_omschrijving'`, a container with `fractie_omschrijving: 'Papier'` gets `/container/papier.svg`.

The icons live in `apps/melding-form/public/`, and the file name has to match the lowercased property value exactly.

If `icon_folder` or the property value is missing, `/asset-fallback.svg` is used. The same fallback is used when the icon file fails to load, for example when there's no SVG for a new property value.

### Adding icons for a new asset type

1. Create a folder in `apps/melding-form/public/`, e.g. `public/afvalbakken/`.
2. Find the WFS property that distinguishes the subtypes you want different icons for.
3. Add an SVG per value of that property, with the lowercased value as the file name.
4. In the Admin, set `icon_folder` to the folder name and `icon_entry` (Koppelcode) to the property name.

Values without a matching SVG show the fallback icon.
