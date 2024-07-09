// import fakeDataProvider from 'ra-data-fakerest'

import type { KeycloakConfig, KeycloakInitOptions } from 'keycloak-js'
import Keycloak from 'keycloak-js'
import { keycloakAuthProvider, httpClient } from 'ra-keycloak'
import { useEffect, useRef, useState } from 'react'
import type { AuthProvider, DataProvider } from 'react-admin'
import { Admin as ReactAdmin, Resource } from 'react-admin'

import { CategoryCreate } from '../../category/CategoryCreate/CategoryCreate'
import { CategoryEdit } from '../../category/CategoryEdit'
import { CategoryList } from '../../category/CategoryList'
import { FormCreate } from '../../form/FormCreate'
import { FormEdit } from '../../form/FormEdit'
import { FormList } from '../../form/FormList'
// import { MainForm } from "../../main-form/MainForm";

import { CustomLayout } from './CustomLayout'
import { dataProvider } from './dataProvider'
import { i18nProvider } from './i18nProvider'

// import { MainForm } from '../MainForm'

// const dataProvider = fakeDataProvider({
//   classification: [
//     {
//       name: 'afval',
//       id: 1,
//       form: 1,
//     },
//     {
//       name: 'afval-container',
//       id: 2,
//       form: 2,
//     },
//     {
//       name: 'boom-illegale-kap',
//       id: 3,
//       form: null,
//     },
//     {
//       name: 'bouw-sloop-overlast',
//       id: 4,
//       form: null,
//     },
//   ],
//   form: [
//     {
//       title: 'Afval',
//       id: 1,
//       classification: 1,
//       components: [
//         {
//           label: 'Text Area',
//           description: 'Description text from api',
//           autoExpand: false,
//           showCharCount: false,
//           key: 'textArea',
//           type: 'textarea',
//           input: true,
//         },
//       ],
//     },
//     {
//       title: 'Afval bij container',
//       id: 2,
//       classification: 2,
//     },
//     {
//       title: 'Illegale boomkap',
//       id: 3,
//       classification: null,
//     },
//     {
//       title: 'Bouw- en sloopoverlast',
//       id: 4,
//       classification: null,
//     },
//   ],
// })

const config: KeycloakConfig = {
  url: 'http://localhost:8002',
  realm: 'meldingen',
  clientId: `meldingen`,
}

// here you can set options for the keycloak client
const initOptions: KeycloakInitOptions = { onLoad: 'login-required' }

export const Admin = () => {
  const [keycloak, setKeycloak] = useState<Keycloak | undefined>(undefined)
  const authProvider = useRef<AuthProvider | undefined>(undefined)
  const dataProviderRef = useRef<DataProvider | undefined>(dataProvider())

  useEffect(() => {
    const timerId = setTimeout(() => {
      const initKeyCloakClient = async () => {
        const keycloakClient = new Keycloak(config)

        keycloakClient.onTokenExpired = () => {
          keycloakClient
            .updateToken(5)
            .then((refreshed) => {
              if (refreshed) {
                // eslint-disable-next-line no-console
                console.log('Token refreshed', refreshed)
              } else {
                // eslint-disable-next-line no-console
                console.log('Token not refreshed')
              }
            })
            .catch(() => {
              // eslint-disable-next-line no-console
              console.error('Failed to refresh token')
              keycloakClient.login()
            })
        }

        await keycloakClient.init(initOptions)

        authProvider.current = keycloakAuthProvider(keycloakClient)
        dataProviderRef.current = dataProvider(process.env.BACKEND_URL, httpClient(keycloakClient))

        setKeycloak(keycloakClient)
      }
      if (!keycloak) {
        initKeyCloakClient()
      }
    }, 0)

    return () => clearTimeout(timerId)
  }, [keycloak])

  // hide the admin until the keycloak client is ready
  if (!keycloak) return <p>Loading...</p>

  return (
    <ReactAdmin
      layout={CustomLayout}
      dataProvider={dataProviderRef.current}
      authProvider={authProvider.current}
      i18nProvider={i18nProvider}
    >
      {/* <Resource name="landingspagina" list={<MainForm />} /> */}
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
