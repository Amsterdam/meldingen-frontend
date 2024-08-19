import { Admin as ReactAdmin, Resource } from 'react-admin'

import { CategoryCreate, CategoryEdit, CategoryList } from '../pages/category'
import { FormCreate, FormEdit, FormList } from '../pages/form/components'

import { CustomLayout } from './components'
import { i18nProvider, useAuthProvider } from './providers'

const Admin = () => {
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
        list={<CategoryList />}
        edit={<CategoryEdit />}
        create={<CategoryCreate />}
        recordRepresentation="name"
      />
    </ReactAdmin>
  )
}

export default Admin
