import { SilentRequest } from '@azure/msal-browser'
import { LoginPage, msalHttpClient, msalRefreshAuth } from 'ra-auth-msal'
import jsonServerProvider from 'ra-data-json-server'
import { addRefreshAuthToDataProvider, Admin as ReactAdmin, Resource } from 'react-admin'
import { BrowserRouter } from 'react-router-dom'

import { authProvider, myMSALObj } from '../authProvider'
import { AssetTypeCreate, AssetTypeEdit, AssetTypeList } from '../pages/asset-types'
import { ClassificationCreate, ClassificationEdit, ClassificationList } from '../pages/classification'
import { FormCreate, FormEdit, FormList } from '../pages/form/components'
import { StaticFormEdit, StaticFormList } from '../pages/static-form'
import { CustomLayout } from './components'
import { i18nProvider } from './providers'
// import { dataProvider } from './providers/dataProvider'

// Based on:
// https://github.com/marmelab/ra-auth-msal/tree/main/packages/demo-react-admin
// https://marmelab.com/blog/2023/09/13/active-directory-integration-tutorial.html

const tokenRequest: SilentRequest = {
  forceRefresh: false, // Set this to "true" to skip a cached token and go to the server to get a new token
  scopes: ['User.Read'],
}

const httpClient = msalHttpClient({
  msalInstance: myMSALObj,
  tokenRequest,
})

export const Admin = () => {
  // const { authProvider, dataProviderRef } = useAuthProvider() // keycloakClient

  // if (!keycloakClient) return <p>Loading...</p>

  const dataProvider = addRefreshAuthToDataProvider(
    jsonServerProvider('http://localhost:8000', httpClient),
    msalRefreshAuth({
      msalInstance: myMSALObj,
      tokenRequest,
    }),
  )

  return (
    <BrowserRouter>
      <ReactAdmin
        authProvider={authProvider}
        dataProvider={dataProvider}
        i18nProvider={i18nProvider}
        layout={CustomLayout}
        loginPage={LoginPage}
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
    </BrowserRouter>
  )
}
