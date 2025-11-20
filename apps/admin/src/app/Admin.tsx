import { Admin as ReactAdmin, Resource } from 'react-admin'

import { AssetTypeCreate, AssetTypeEdit, AssetTypeList } from '../pages/asset-types'
import { ClassificationCreate, ClassificationEdit, ClassificationList } from '../pages/classification'
import { FormCreate, FormEdit, FormList } from '../pages/form/components'
import { StaticFormEdit, StaticFormList } from '../pages/static-form'
import { CustomLayout } from './components'
import { i18nProvider, useAuthProvider } from './providers'

export const Admin = () => {
  const { authProvider, dataProviderRef, keycloakClient } = useAuthProvider()

  if (!keycloakClient) return <p>Loading...</p>

  return (
    <ReactAdmin
      authProvider={authProvider.current}
      dataProvider={dataProviderRef.current}
      i18nProvider={i18nProvider}
      layout={CustomLayout}
    >
      <Resource create={<FormCreate />} edit={<FormEdit />} list={<FormList />} name="form" />
      <Resource
        create={<ClassificationCreate />}
        edit={<ClassificationEdit />}
        list={<ClassificationList />}
        name="classification"
        recordRepresentation="name"
      />
      <Resource edit={<StaticFormEdit />} list={<StaticFormList />} name="static-form" recordRepresentation="name" />
      <Resource create={<AssetTypeCreate />} edit={<AssetTypeEdit />} list={<AssetTypeList />} name="asset-type" />
    </ReactAdmin>
  )
}
