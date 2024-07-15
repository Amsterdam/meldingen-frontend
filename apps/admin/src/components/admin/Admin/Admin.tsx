import { Admin as ReactAdmin, Resource } from 'react-admin'

import { CategoryCreate } from '../../category/CategoryCreate/CategoryCreate'
import { CategoryEdit } from '../../category/CategoryEdit'
import { CategoryList } from '../../category/CategoryList'
import { FormCreate } from '../../form/FormCreate'
import { FormEdit } from '../../form/FormEdit'
import { FormList } from '../../form/FormList'

import { CustomLayout } from './CustomLayout'
import { i18nProvider } from './i18nProvider'
import { useAuthProvider } from './useAuthProvider'

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
        list={<CategoryList />}
        edit={<CategoryEdit />}
        create={<CategoryCreate />}
        recordRepresentation="name"
      />
    </ReactAdmin>
  )
}
