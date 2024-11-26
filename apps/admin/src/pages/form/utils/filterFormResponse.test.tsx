import { filterFormResponse } from './filterFormResponse'
import { mockData } from './filterFormResponseMock'

// This test compares the output of the function to a snapshot.
// To update the snapshot, run the following command:
// npx nx test admin filterFormResponse.spec.tsx --updateSnapshot
describe('filterFormResponse', () => {
  it('renders the correct output', () => {
    expect(filterFormResponse(mockData)).toMatchSnapshot()
  })
})
