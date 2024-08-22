import { Admin as ReactAdmin, Resource } from 'react-admin'

import { ClassificationCreate, ClassificationEdit, ClassificationList } from '../pages/classification'
import { FormCreate, FormEdit, FormList } from '../pages/form/components'

import { CustomLayout } from './components'
import { i18nProvider, useAuthProvider } from './providers'

export const Admin = () => {
  const { keycloak, dataProviderRef, authProvider } = useAuthProvider()

  if (!keycloak) return <p>Loading...</p>

  return (
    <ReactAdmin
      layout={CustomLayout}
      dataProvider={dataProviderRef.current}
      authProvider={authProvider.current}
      i18nProvider={i18nProvider}
    >
      <Resource name="form" list={<FormList />} edit={<FormEdit />} create={<FormCreate />} />
      <Resource
        name="classification"
        list={<ClassificationList />}
        edit={<ClassificationEdit />}
        create={<ClassificationCreate />}
        recordRepresentation="name"
      />
    </ReactAdmin>
  )
}
