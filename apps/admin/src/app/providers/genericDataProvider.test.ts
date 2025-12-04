import { genericDataProvider } from './genericDataProvider'

describe('genericDataProvider', () => {
  it('uses a PUT request for the `form` resource', async () => {
    const httpClient = vi.fn().mockResolvedValue({ json: { id: 1 } })

    const client = genericDataProvider('http://localhost:3000', httpClient)

    await client.update('form', {
      data: {},
      id: 1,
      previousData: { id: 1 },
    })

    expect(httpClient).toHaveBeenCalledWith('http://localhost:3000/form/1', {
      body: '{}',
      method: 'PUT',
    })
  })

  it('uses a PATCH request for all other resources', async () => {
    const httpClient = vi.fn().mockResolvedValue({ json: { id: 1 } })

    const client = genericDataProvider('http://localhost:3000', httpClient)

    await client.update('other', {
      data: {},
      id: 1,
      previousData: { id: 1 },
    })

    expect(httpClient).toHaveBeenCalledWith('http://localhost:3000/other/1', {
      body: '{}',
      method: 'PATCH',
    })
  })
})
