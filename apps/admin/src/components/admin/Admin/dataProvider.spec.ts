import { dataProvider } from './dataProvider'

describe('dataProvider', () => {
  it('uses a PUT request for the `form` resource', async () => {
    const httpClient = jest.fn().mockResolvedValue({ json: { id: 1 } })

    const client = dataProvider(httpClient, 'http://localhost:3000')

    await client.update('form', {
      id: 1,
      previousData: { id: 1 },
      data: {},
    })

    expect(httpClient).toHaveBeenCalledWith('http://localhost:3000/form/1', {
      method: 'PUT',
      body: '{}',
    })
  })

  it('uses a PATCH request for all other resources', async () => {
    const httpClient = jest.fn().mockResolvedValue({ json: { id: 1 } })

    const client = dataProvider(httpClient, 'http://localhost:3000')

    await client.update('other', {
      id: 1,
      previousData: { id: 1 },
      data: {},
    })

    expect(httpClient).toHaveBeenCalledWith('http://localhost:3000/other/1', {
      method: 'PATCH',
      body: '{}',
    })
  })
})
