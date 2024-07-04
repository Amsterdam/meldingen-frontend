// import fakeDataProvider from 'ra-data-fakerest'
import type { KeycloakConfig, KeycloakTokenParsed, KeycloakInitOptions } from 'keycloak-js'
import Keycloak from 'keycloak-js'
import simpleRestProvider from 'ra-data-simple-rest'
import polyglotI18nProvider from 'ra-i18n-polyglot'
import { keycloakAuthProvider, httpClient } from 'ra-keycloak'
import nl from 'ra-language-dutch'
import React, { useState, useRef, useEffect } from 'react'
import type { AuthProvider, DataProvider } from 'react-admin'
import { Admin as ReactAdmin, Resource } from 'react-admin'

import { CategoryCreate } from '../../category/CategoryCreate/CategoryCreate'
import { CategoryEdit } from '../../category/CategoryEdit'
import { CategoryList } from '../../category/CategoryList'
import { FormCreate } from '../../form/FormCreate'
import { FormEdit } from '../../form/FormEdit'
import { FormList } from '../../form/FormList'

import { CustomLayout } from './CustomLayout'
import { dataProvider as myDataProvider, keyCloakTokenDataProviderBuilder } from './dataProvider'
// import { MainForm } from '../MainForm'

// import { Admin, Resource, AuthProvider, DataProvider } from 'react-admin';

const config: KeycloakConfig = {
  url: "http://localhost:8002/",
  realm: 'meldingen',
  clientId: `meldingen`,
}

// here you can set options for the keycloak client
const initOptions: KeycloakInitOptions = { onLoad: 'login-required', checkLoginIframe: false}

// here you can implement the permission mapping logic for react-admin
const getPermissions = (decoded: KeycloakTokenParsed) => {
  console.log("---  decoded:", decoded)
  const roles = decoded?.realm_access?.roles
  if (!roles) {
    return false
  }
  if (roles.includes('admin')) return 'admin'
  if (roles.includes('user')) return 'user'
  return false
}

const raKeycloakOptions = {
  // onPermissions: getPermissions,
}

const i18nProvider = polyglotI18nProvider(() => nl, 'nl')

export const Admin = () => {
  const [keycloak, setKeycloak] = useState<Keycloak>(undefined)
  // console.log("---  keycloak:", keycloak)
  const authProvider = useRef<AuthProvider>(undefined)
  // console.log("---  authProvider:", authProvider)
  const dataProvider = useRef<DataProvider>(undefined)
  // console.log("---  dataProvider:", dataProvider)
  
  const keycloakClient = new Keycloak(config)
  console.log("---  keycloakClient:", keycloakClient)
  const initKeyCloakClient = async () => {
    // console.log('init keycloak');
    
    
    // init the keycloak client
    // console.log("---  keycloakClient:", keycloakClient)
    await keycloakClient.init(initOptions)
    // console.log("---  keycloakClient:", keycloakClient)
    // use keycloakAuthProvider to create an authProvider
    authProvider.current = keycloakAuthProvider(keycloakClient, raKeycloakOptions)

    dataProvider.current = keyCloakTokenDataProviderBuilder(myDataProvider(), keycloakClient)
    // example dataProvider using the httpClient helper
    // dataProvider = simpleRestProvider('http://localhost:8000', httpClient(keycloakClient))
    setKeycloak(keycloakClient)
  }
  useEffect(() => {
    // if (keycloakClient === undefined) {
      console.log("---  keycloak init:", keycloak)
      initKeyCloakClient()
    // }
  }, [])

  // hide the admin until the keycloak client is ready
  if (!keycloak) return <p>Loading...</p>

  return (
    <ReactAdmin
      layout={CustomLayout}
      dataProvider={dataProvider.current}
      authProvider={authProvider.current}
      i18nProvider={i18nProvider}
    >
      {/* <Resource name="landingspagina" list={<MainForm />} /> */}
      {/* <Resource
        name="form"
        list={<FormList />}
        edit={<FormEdit />}
        create={<FormCreate />}
        options={{ label: 'Vragenlijsten' }}
      /> */}
      <Resource
        name="classification"
        list={<CategoryList />}
        edit={<CategoryEdit />}
        create={<CategoryCreate />}
        options={{ label: 'Categorieën' }}
        recordRepresentation="name"
      />
    </ReactAdmin>
  )
}
