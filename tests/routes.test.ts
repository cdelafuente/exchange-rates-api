import request from 'supertest'
import app from '../src/server'
import { isWorkday } from '../src/utils'
import { v4 as uuidv4 } from 'uuid'

describe('Exchange rate convert route', () => {
  it('Converts USD to EUR', async () => {
    const res = await request(app)
      .get('/v1/exchange-rates/convert?from=USD&to=EUR&amount=2')
      .set('Authorization', 'Bearer 123')

    expect(res.status).toEqual(200)
    expect(res.body.data).toBeDefined()
    expect(res.body.data.from).toEqual('USD')
    expect(res.body.data.to).toEqual('EUR')
    expect(res.body.data.rate).toEqual(1.89193)

    console.log(res['headers'])
  })

  it('Returns bad request error when currency is invalid', async () => {
    const res = await request(app)
      .get('/v1/exchange-rates/convert?from=USD&to=AAA&amount=1')
      .set('Authorization', 'Bearer 123')

    expect(res.status).toEqual(400)
    expect(res.body.errors).toBeDefined()
  })

  it('Returns unauthorized error when auth token is missing', async () => {
    const res = await request(app).get('/v1/exchange-rates/convert?from=USD&to=AAA&amount=1')

    expect(res.status).toEqual(401)
    expect(res.body.error).toBe('Missing token')
  })

  it('Returns too many requests error when rate limit is exceeded', async () => {
    const limit = isWorkday() ? 100 : 200
    const requests = []
    const userId = uuidv4()

    for (let i = 0; i < limit + 1; i++) {
      requests.push(
        request(app)
          .get('/v1/exchange-rates/convert?from=USD&to=EUR&amount=1')
          .set('Authorization', `Bearer ${userId}`),
      )
    }

    const responses = await Promise.all(requests)
    expect(responses[limit].status).toBe(429)
  })
})
