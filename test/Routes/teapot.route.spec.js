import { assert, should, expect } from 'chai'
import request from 'supertest'
import config from '../../src/config'
import server from '../../src/server'
const baseURI = `/${config.get('API_VERSION')}/teapot`

describe('Teapot API Route', () => {
  describe('GET /teapot', () => {
    it('should return status 418', (done) => {
      request(server)
        .get(baseURI)
        .expect(418)
        .end((err, res) => {
          if (err) return done(err)
          done()
        })
    })
    it('should contain a message', (done) => {
      request(server)
        .get(baseURI)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.body).to.haveOwnProperty('message')
          done()
        })
    })
  })
})
