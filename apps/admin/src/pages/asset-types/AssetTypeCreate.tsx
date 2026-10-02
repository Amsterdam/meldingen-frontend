import { Create, SaveButton, SimpleForm, Toolbar, ToolbarClasses } from 'react-admin'

import { AssetTypeFields } from './AssetTypeFields'

type AssetTypeCreateData = {
  arguments: unknown
  max_assets: number
  name: string
}

export const transform = (data: AssetTypeCreateData) => ({
  ...data,
  // class_name defines the way the assets are fetched.
  // Currently only meldingen.wfs.ProxyWfsProviderFactory class is available.
  class_name: 'meldingen.wfs.ProxyWfsProviderFactory',
})

export const AssetTypeCreate = () => (
  <Create redirect="list" resource="asset-type" transform={transform}>
    <SimpleForm
      toolbar={
        <Toolbar>
          <div className={ToolbarClasses.defaultToolbar}>
            <SaveButton alwaysEnable />
          </div>
        </Toolbar>
      }
    >
      <AssetTypeFields />
    </SimpleForm>
  </Create>
)
