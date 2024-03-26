'use client'

import fakeDataProvider from 'ra-data-fakerest'
import { Admin, Resource } from 'react-admin'

import { Builder } from '../Builder'
import { CategoryEdit } from '../CategoryEdit'
import { CategoryList } from '../CategoryList'
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

export function AdminApp({ data }: any) {
  return (
    <Admin dataProvider={dataProvider}>
      <Resource name="landingspagina" list={<Builder data={data} />} />
      <Resource name="categories" list={<CategoryList />} edit={<CategoryEdit />} recordRepresentation="name" />
      <Resource name="surveys" list={<SurveyList />} edit={<SurveyEdit />} recordRepresentation="name" />
    </Admin>
  )
}
