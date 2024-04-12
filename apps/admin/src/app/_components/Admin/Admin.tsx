import fakeDataProvider from 'ra-data-fakerest'
import { Admin as ReactAdmin, Resource } from 'react-admin'

import { CategoryEdit } from '../CategoryEdit'
import { CategoryList } from '../CategoryList'
import { Layout } from '../Layout'
import { MainForm } from '../MainForm'
import { SurveyEdit } from '../SurveyEdit'
import { SurveyList } from '../SurveyList'

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
  surveys: [
    {
      name: 'Afval',
      id: 1,
    },
    {
      name: 'Afval bij container',
      id: 2,
    },
    {
      name: 'Illegale boomkap',
      id: 3,
    },
    {
      name: 'Bouw- en sloopoverlast',
      id: 4,
    },
  ],
})

export const Admin = () => (
  <ReactAdmin layout={Layout} dataProvider={dataProvider}>
    <Resource name="landingspagina" list={<MainForm />} />
    <Resource name="categories" list={<CategoryList />} edit={<CategoryEdit />} recordRepresentation="name" />
    <Resource name="surveys" list={<SurveyList />} edit={<SurveyEdit />} recordRepresentation="name" />
  </ReactAdmin>
)
