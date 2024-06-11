// import fakeDataProvider from 'ra-data-fakerest'

import { Admin as ReactAdmin, Resource } from 'react-admin'

import { CategoryCreate } from '../../category/CategoryCreate/CategoryCreate'
import { CategoryEdit } from '../../category/CategoryEdit'
import { CategoryList } from '../../category/CategoryList'
import { FormCreate } from '../../form/FormCreate'
import { FormEdit } from '../../form/FormEdit'
import { FormList } from '../../form/FormList'

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

export const Admin = () => (
  <ReactAdmin layout={CustomLayout} dataProvider={dataProvider()} i18nProvider={i18nProvider}>
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
