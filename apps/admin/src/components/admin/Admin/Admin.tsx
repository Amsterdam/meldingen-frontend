import fakeDataProvider from 'ra-data-fakerest'
import { Admin as ReactAdmin, Resource } from 'react-admin'

// import { dataProvider } from '../../dataProvider'
import { CategoryEdit } from '../../category/CategoryEdit'
import { CategoryList } from '../../category/CategoryList'
import { FormCreate } from '../../form/FormCreate'
import { FormEdit } from '../../form/FormEdit'
import { FormList } from '../../form/FormList'
// import { MainForm } from '../MainForm'

const dataProvider = fakeDataProvider({
  categories: [
    {
      name: 'afval',
      id: 1,
    },
    {
      name: 'afval-container',
      id: 2,
    },
    {
      name: 'boom-illegale-kap',
      id: 3,
    },
    {
      name: 'bouw-sloop-overlast',
      id: 4,
    },
  ],
  form: [
    {
      title: 'Afval',
      id: 1,
      components: [
        {
          label: 'Text Area',
          description: 'Description text from api',
          autoExpand: false,
          showCharCount: false,
          key: 'textArea',
          type: 'textarea',
          input: true,
        },
      ],
    },
    {
      title: 'Afval bij container',
      id: 2,
    },
    {
      title: 'Illegale boomkap',
      id: 3,
    },
    {
      title: 'Bouw- en sloopoverlast',
      id: 4,
    },
  ],
})

export const Admin = () => (
  <ReactAdmin dataProvider={dataProvider}>
    {/* <Resource name="landingspagina" list={<MainForm />} /> */}
    <Resource
      name="form"
      list={<FormList />}
      edit={<FormEdit />}
      create={<FormCreate />}
      options={{ label: 'Vragenlijsten' }}
    />
    <Resource name="categories" list={<CategoryList />} edit={<CategoryEdit />} options={{ label: 'Categorieën' }} />
  </ReactAdmin>
)
