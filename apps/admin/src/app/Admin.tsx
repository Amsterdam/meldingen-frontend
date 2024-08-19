import { Admin as ReactAdmin, Resource } from 'react-admin'

import { CategoryCreate } from '../pages/category/CategoryCreate'
import { CategoryEdit } from '../pages/category/CategoryEdit'
import { CategoryList } from '../pages/category/CategoryList'
import { FormCreate } from '../pages/form/components/FormCreate'
import { FormEdit } from '../pages/form/components/FormEdit'
import { FormList } from '../pages/form/components/FormList'

import { CustomLayout } from './components/CustomLayout'
import { i18nProvider } from './providers/i18nProvider'
import { useAuthProvider } from './providers/useAuthProvider'

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
