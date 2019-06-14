import { assert, should, expect } from 'chai'
import request from 'supertest'
import config from '../../src/config'
import server from '../../src/server'
const req = request(server)
const baseURI = `/${config.get('API_VERSION')}`

describe('Teapot API Route', () => {
  describe('GET /teapot', () => {
    it('should return status 418', async () => {
      await req.get(baseURI + '/teapot').then((res) => {
        const { status } = res
        expect(status).to.equal(418)
      })
    })
    it('should contain a message', async () => {
      await req.get(baseURI + '/teapot').then((res) => {
        const { body } = res
        expect(body).to.have.property('message')
      })
    })
  })
})
